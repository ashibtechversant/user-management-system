const createHttpError = require('http-errors');
const loginSchema = require('../schemas/login-schema');
const { checkPassword, hashPassword } = require('../utils/bcrypt-utils');
const {
  generateToken,
  generateRefreshToken,
  verifyRefreshToken,
  generateOtpToken,
  verifyOtpToken,
} = require('../utils/jwt-utils');
const responseFormatter = require('../utils/helpers/controllers/response-formatter');
const handleJoiError = require('../utils/helpers/controllers/handle-joi-error');
const generateOtp = require('../utils/helpers/controllers/auth/generate-otp');
const sendOtp = require('../utils/helpers/controllers/auth/send-otp');
const verifyOtpSchema = require('../schemas/verify-otp-schema');
const {
  updateUserWithId,
  deleteFieldsFromUser,
} = require('../utils/helpers/data/manage-users');
const getUserByEmail = require('../utils/helpers/controllers/auth/get-user-by-email');
const resetPasswordSchema = require('../schemas/reset-password-schema');

module.exports = {
  async login(req, res, next) {
    try {
      const loginData = await loginSchema.validateAsync(req.body);
      const user = await getUserByEmail(loginData.email);
      const isPasswordValid = await checkPassword(
        loginData.password,
        user.password
      );
      if (!isPasswordValid)
        throw createHttpError.Unauthorized('incorrect email or password');
      const accessToken = generateToken(user.id);
      const refreshToken = generateRefreshToken(user.id);
      const userDetails = {
        accessToken,
        accessTokenValidity: '1 hour',
        refreshToken,
        refreshTokenValidity: '30 days',
        role: user.role,
      };
      res.json(
        responseFormatter('authentication successful', {
          user: userDetails,
        })
      );
    } catch (error) {
      handleJoiError(error, next);
    }
  },

  async refreshToken(req, res, next) {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken)
        throw createHttpError.BadRequest('missing refresh token');
      try {
        const { userId } = verifyRefreshToken(refreshToken);
        const accessToken = generateToken(userId);
        const newRefreshToken = generateRefreshToken(userId);
        const user = {
          accessToken,
          accessTokenValidity: '1 hour',
          refreshToken: newRefreshToken,
          refreshTokenValidity: '30 days',
        };
        res.status(201).json(responseFormatter('tokens refreshed', { user }));
      } catch (error) {
        throw createHttpError.Unauthorized('invalid token');
      }
    } catch (error) {
      next(error);
    }
  },

  async forgotPassword(req, res, next) {
    try {
      const { email } = req.body;
      if (!email) throw createHttpError.BadRequest('no email provided');
      const foundUser = await getUserByEmail(email);
      const userId = foundUser.id;
      const otp = generateOtp();
      const otpExpiringAt = new Date();
      otpExpiringAt.setMinutes(otpExpiringAt.getMinutes() + 5);
      const updationData = { otp, otpExpiringAt };
      await sendOtp(email, otp);
      await updateUserWithId(userId, updationData);
      res.json(responseFormatter('otp sent successfully'));
    } catch (error) {
      next(error);
    }
  },

  async verifyOtp(req, res, next) {
    try {
      const otpData = await verifyOtpSchema.validateAsync(req.body);
      const user = await getUserByEmail(otpData.email);
      const currentDateTime = new Date();
      const otpExpiringDateTime = new Date(user.otpExpiringAt);
      const isOtpValid = otpExpiringDateTime > currentDateTime;
      if (!isOtpValid) throw createHttpError.BadRequest('otp has expired');
      if (user.otp !== otpData.otp)
        throw createHttpError.BadRequest('invalid otp');
      const otpToken = generateOtpToken(user.otp, user.email);
      const otp = { otpToken, otpTokenValidity: '15 minutes' };
      res.json(responseFormatter('otp verification successful', { otp }));
    } catch (error) {
      handleJoiError(error, next);
    }
  },

  async resetPassword(req, res, next) {
    try {
      const resetData = await resetPasswordSchema.validateAsync(req.body);
      try {
        const { otp, email } = verifyOtpToken(resetData.otpToken);
        const user = await getUserByEmail(email);
        if (user.otp !== otp)
          throw createHttpError.Unauthorized('invalid token');
        const hashedPassword = await hashPassword(resetData.newPassword);
        const updationData = { password: hashedPassword };
        await deleteFieldsFromUser(user.id, 'otp', 'otpExpiringAt');
        await updateUserWithId(user.id, updationData);
      } catch (error) {
        throw createHttpError.Unauthorized('invalid token');
      }
      res.json(responseFormatter('password reset successful'));
    } catch (error) {
      handleJoiError(error, next);
    }
  },
};

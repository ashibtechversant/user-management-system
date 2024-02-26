const createHttpError = require('http-errors');
const loginSchema = require('../schemas/login-schema');
const { checkPassword } = require('../utils/bcrypt-utils');
const {
  generateToken,
  generateRefreshToken,
  verifyRefreshToken,
} = require('../utils/jwt-utils');
const responseFormatter = require('../utils/helpers/controllers/response-formatter');
const handleJoiError = require('../utils/helpers/controllers/handle-joi-error');
const generateOtp = require('../utils/helpers/controllers/auth/generate-otp');
const sendOtp = require('../utils/helpers/controllers/auth/send-otp');
const verifyOtpSchema = require('../schemas/verify-otp-schema');
const { updateUserWithId } = require('../utils/helpers/data/manage-users');
const getUserByEmail = require('../utils/helpers/controllers/auth/get-user-by-email');

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
        refreshToken,
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
          refreshToken: newRefreshToken,
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
      const otpCreatedAt = new Date();
      const updationData = { otp, otpCreatedAt };
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
      const otpCreatedAt = new Date(user.otpCreatedAt);
    } catch (error) {
      handleJoiError(error, next);
    }
  },
};

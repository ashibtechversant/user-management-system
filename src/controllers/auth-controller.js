const createHttpError = require('http-errors');
const users = require('../../data/users.json');
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
const writeUsers = require('../utils/helpers/data/write-users');
const sendOtp = require('../utils/helpers/controllers/auth/send-otp');
const verifyOtpSchema = require('../schemas/verify-otp-schema');

module.exports = {
  async login(req, res, next) {
    try {
      const loginData = await loginSchema.validateAsync(req.body);
      const user = users.find((obj) => obj.email === loginData.email);
      if (!user) throw createHttpError.NotFound('user not found');
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
      const userIndex = users.findIndex((e) => e.email === email);
      if (userIndex === -1) throw createHttpError.NotFound('no user found');
      const user = users[userIndex];
      const otp = generateOtp();
      const otpCreatedAt = new Date();
      const updatedUser = { ...user, otp, otpCreatedAt };
      await sendOtp(email, otp);
      users.splice(userIndex, 1, updatedUser);
      await writeUsers(users);
      res.json(responseFormatter('otp sent successfully'));
    } catch (error) {
      next(error);
    }
  },

  async verifyOtp(req, res, next) {
    try {
      const otpData = await verifyOtpSchema.validateAsync(req.body);
    } catch (error) {
      handleJoiError(error, next);
    }
  },
};

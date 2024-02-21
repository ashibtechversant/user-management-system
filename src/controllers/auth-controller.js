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

module.exports = {
  async login(req, res, next) {
    try {
      const result = await loginSchema.validateAsync(req.body);
      const user = users.find((obj) => obj.email === result.email);
      if (!user) throw createHttpError.NotFound('user not found');
      const isPasswordValid = await checkPassword(
        result.password,
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
        res.status(201).json(responseFormatter('tokens refreshed'), { user });
      } catch (error) {
        throw createHttpError.Unauthorized('invalid token');
      }
    } catch (error) {
      next(error);
    }
  },
};

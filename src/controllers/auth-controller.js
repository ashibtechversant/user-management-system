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
      res.json(
        responseFormatter('authentication successful', {
          accessToken,
          refreshToken,
          role: user.role,
        })
      );
    } catch (error) {
      handleJoiError(error, next);
    }
  },

  async refreshToken(req, res, next) {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) throw createHttpError.BadRequest();
      try {
        const { userId } = verifyRefreshToken(refreshToken);
        const accessToken = generateToken(userId);
        const newRefreshToken = generateRefreshToken(userId);
        res.status(201).json(
          responseFormatter('tokens refreshed', {
            accessToken,
            refreshToken: newRefreshToken,
          })
        );
      } catch (error) {
        throw createHttpError.Unauthorized();
      }
    } catch (error) {
      next(error);
    }
  },
};

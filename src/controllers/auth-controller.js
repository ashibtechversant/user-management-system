const createHttpError = require('http-errors');
const users = require('../../data/users.json');
const loginSchema = require('../schemas/login-schema');
const { checkPassword } = require('../utils/bcrypt-utils');
const {
  generateToken,
  generateRefreshToken,
  verifyRefreshToken,
} = require('../utils/jwt-utils');

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
      res.json({
        status: 'true',
        message: 'authentication successful',
        data: { accessToken, refreshToken, role: user.role },
      });
    } catch (error) {
      if (error.isJoi) next(createHttpError.UnprocessableEntity());
      else next(error);
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
        res.status(201).json({
          status: 'true',
          message: 'tokens refreshed',
          data: { accessToken, refreshToken: newRefreshToken },
        });
      } catch (error) {
        throw createHttpError.Unauthorized();
      }
    } catch (error) {
      next(error);
    }
  },
};

const createHttpError = require('http-errors');
const { verifyToken } = require('../utils/jwt-utils');

module.exports = async (req, _, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) throw createHttpError.Unauthorized('invalid token');
    const [, token] = authHeader.split(' ');
    if (!token) throw createHttpError.BadRequest('missing token');
    try {
      const payload = verifyToken(token);
      req.payload = payload;
      next();
    } catch (error) {
      throw createHttpError.Unauthorized('invalid token');
    }
  } catch (error) {
    next(error);
  }
};

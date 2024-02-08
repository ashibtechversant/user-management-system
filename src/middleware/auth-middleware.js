const createHttpError = require('http-errors');
const { verifyToken } = require('../utils/jwt-utils');

module.exports = async (req, _, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) throw createHttpError.Unauthorized();
    const [, token] = authHeader.split(' ');
    if (!token) throw createHttpError.BadRequest('token is missing');
    try {
      const payload = verifyToken(token);
      req.payload = payload;
      next();
    } catch (error) {
      throw createHttpError.Unauthorized();
    }
  } catch (error) {
    next(error);
  }
};

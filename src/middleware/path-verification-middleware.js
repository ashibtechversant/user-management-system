const createHttpError = require('http-errors');
const convertUserIdInPath = require('../utils/helpers/controllers/convert-user-id-in-path');

module.exports = async (req, _, next, userId) => {
  try {
    const { userId: payloadUserId } = req.payload;
    const convertedUserId = convertUserIdInPath(userId);
    if (!payloadUserId) throw createHttpError.Unauthorized('invalid token');
    if (payloadUserId !== convertedUserId)
      throw createHttpError.Forbidden('authorization failed');
    next();
  } catch (error) {
    next(error);
  }
};

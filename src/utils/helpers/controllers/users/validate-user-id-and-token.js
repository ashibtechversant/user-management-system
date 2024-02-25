const createHttpError = require('http-errors');

module.exports = (payloadUserId, paramsUserId) => {
  const numParamsUserId = Number(paramsUserId);
  if (Number.isNaN(numParamsUserId))
    throw createHttpError.BadRequest('invalid userId in path');
  if (!payloadUserId) throw createHttpError.Unauthorized('invalid token');
  if (payloadUserId !== numParamsUserId)
    throw createHttpError.Forbidden('authorization failed');
};

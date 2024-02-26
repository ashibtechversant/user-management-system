const createHttpError = require('http-errors');

module.exports = (userId) => {
  const id = Number(userId);
  if (Number.isNaN(id))
    throw createHttpError.BadRequest('invalid userId in path');
  return id;
};

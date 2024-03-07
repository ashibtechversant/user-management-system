const createHttpError = require('http-errors');

module.exports = (error, next) => {
  if (error.isJoi) next(createHttpError.UnprocessableEntity());
  else next(error);
};

const createHttpError = require('http-errors');

module.exports = async (_, __, next) => {
  next(createHttpError.MethodNotAllowed());
};

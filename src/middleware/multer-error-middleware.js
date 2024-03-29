const createHttpError = require('http-errors');
const multer = require('multer');

module.exports = async (err, _, __, next) => {
  try {
    if (err instanceof multer.MulterError)
      throw createHttpError.ExpectationFailed(
        'expected field not found or multiple files uploaded'
      );
    if (err.message === 'Unexpected end of form')
      throw createHttpError.BadRequest(err.message + err.code);
    if (err.message === 'Input buffer contains unsupported image format')
      throw createHttpError.UnsupportedMediaType(err.message);
    throw err;
  } catch (error) {
    next(error);
  }
};

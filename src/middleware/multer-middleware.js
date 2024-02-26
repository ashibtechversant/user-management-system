const createHttpError = require('http-errors');
const multer = require('multer');

const storage = multer.memoryStorage();

const fileFilter = (_, file, next) => {
  try {
    if (!file.mimetype.startsWith('image'))
      throw createHttpError.UnsupportedMediaType('file is not an image');
    next(null, true);
  } catch (error) {
    next(error);
  }
};

module.exports = multer({ storage, fileFilter });

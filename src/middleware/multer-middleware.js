const createHttpError = require('http-errors');
const multer = require('multer');
const { validateUserId } = require('../utils/helpers/controllers/users');

const storage = multer.memoryStorage();

const fileFilter = (req, file, next) => {
  try {
    const { userId: paramsUserId } = req.params;
    const { userId: payloadUserId } = req.payload;
    validateUserId(payloadUserId, paramsUserId);
    if (!file.mimetype.startsWith('image'))
      throw createHttpError.UnsupportedMediaType('file is not an image');
    next(null, true);
  } catch (error) {
    next(error);
  }
};

module.exports = multer({ storage, fileFilter });

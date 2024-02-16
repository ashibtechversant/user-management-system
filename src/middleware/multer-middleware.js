const createHttpError = require('http-errors');
const multer = require('multer');
const { validateUserId } = require('../utils/helpers/controllers/users');

const storage = multer.memoryStorage();

const fileFilter = (req, file, next) => {
  const { userId: paramsUserId } = req.params;
  const { userId: payloadUserId } = req.payload;
  try {
    validateUserId(payloadUserId, paramsUserId);
  } catch (err) {
    next(err);
  }
  if (file.mimetype.startsWith('image')) {
    next(null, true);
  } else {
    next(createHttpError.BadRequest('please upload an image file'));
  }
};

module.exports = multer({ storage, fileFilter });

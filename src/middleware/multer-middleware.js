const createHttpError = require('http-errors');
const multer = require('multer');

const storage = multer.memoryStorage();

const fileFilter = (_, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(createHttpError.BadRequest('please upload an image file'));
  }
};

module.exports = multer({ storage, fileFilter });

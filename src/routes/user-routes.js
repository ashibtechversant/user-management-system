const express = require('express');
const userController = require('../controllers/user-controller');
const authenticatioMiddleware = require('../middleware/authentication-middleware');
const methodNotAllowedMiddleware = require('../middleware/method-not-allowed-middleware');
const multerMiddleware = require('../middleware/multer-middleware');
const resizeImageMiddleware = require('../middleware/resize-image-middleware');
const multerErrorMiddleware = require('../middleware/multer-error-middleware');
const pathVerificationMiddleware = require('../middleware/path-verification-middleware');

const router = express.Router();

router.use(authenticatioMiddleware);

router
  .route('/:userId')
  .get(userController.getUser)
  .put(userController.updateUser)
  .patch(userController.updateUser)
  .all(methodNotAllowedMiddleware);

router
  .route('/:userId/password')
  .put(userController.changePassword)
  .patch(userController.changePassword)
  .all(methodNotAllowedMiddleware);

router
  .route('/:userId/profile-picture')
  .post(
    multerMiddleware.single('file'),
    resizeImageMiddleware,
    userController.uploadImage,
    multerErrorMiddleware
  )
  .all(methodNotAllowedMiddleware);

router.param('userId', pathVerificationMiddleware);

module.exports = router;

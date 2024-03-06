const express = require('express');
const userController = require('../controllers/user-controller');
const authenticationMiddleware = require('../middleware/authentication-middleware');
const methodNotAllowedMiddleware = require('../middleware/method-not-allowed-middleware');
const multerMiddleware = require('../middleware/multer-middleware');
const resizeImageMiddleware = require('../middleware/resize-image-middleware');
const multerErrorMiddleware = require('../middleware/multer-error-middleware');

const router = express.Router();

router.use(authenticationMiddleware);

router
  .route('/me')
  .get(userController.getUserProfile)
  .put(userController.updateUser)
  .patch(userController.updateUser)
  .all(methodNotAllowedMiddleware);

router
  .route('/me/password')
  .put(userController.changePassword)
  .patch(userController.changePassword)
  .all(methodNotAllowedMiddleware);

router
  .route('/me/profile-picture')
  .post(
    multerMiddleware.single('file'),
    resizeImageMiddleware,
    userController.uploadImage,
    multerErrorMiddleware
  )
  .all(methodNotAllowedMiddleware);

module.exports = router;

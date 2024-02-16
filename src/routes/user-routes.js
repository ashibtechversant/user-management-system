const express = require('express');
const userController = require('../controllers/user-controller');
const authMiddleware = require('../middleware/authentication-middleware');
const methodNotAllowedMiddleware = require('../middleware/method-not-allowed-middleware');
const multerMiddleware = require('../middleware/multer-middleware');
const resizeImageMiddleware = require('../middleware/resize-image-middleware');

const router = express.Router();

router.use(authMiddleware);

router
  .route('/:userId')
  .get(userController.getUser)
  .put(userController.updateUser)
  .patch(userController.updateUser)
  .all(methodNotAllowedMiddleware);

router
  .route('/:userId/password')
  .put(userController.changePassword)
  .patch(userController.changePassword);

router.post(
  '/:userId/profile-picture',
  multerMiddleware.single('file'),
  resizeImageMiddleware,
  userController.uploadImage
);

module.exports = router;

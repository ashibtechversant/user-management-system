const express = require('express');
const userController = require('../controllers/user-controller');
const authMiddleware = require('../middleware/auth-middleware');
const methodNotAllowedMiddleware = require('../middleware/method-not-allowed-middleware');

const router = express.Router();

router.use(authMiddleware);

router
  .route('/:userId')
  .get(userController.getUser)
  .put(userController.updateUser)
  .patch(userController.updateUser)
  .all(methodNotAllowedMiddleware);

router.put('/:userId/password', userController.changePassword);

module.exports = router;

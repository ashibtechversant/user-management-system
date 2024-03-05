const express = require('express');
const adminController = require('../controllers/admin-controller');
const authenticationMiddleware = require('../middleware/authentication-middleware');
const authorizationMiddleware = require('../middleware/authorization-middleware');
const methodNotAllowedMiddleware = require('../middleware/method-not-allowed-middleware');
const userController = require('../controllers/user-controller');

const router = express.Router();

router.use(authenticationMiddleware);
router.use(authorizationMiddleware('admin'));

router
  .route('/users')
  .get(userController.getAllUsers)
  .post(adminController.registerUsers)
  .all(methodNotAllowedMiddleware);

router
  .route('/users/:userId')
  .get(userController.getUser)
  .put(adminController.updateUser)
  .patch(adminController.updateUser)
  .delete(adminController.deleteUser)
  .all(methodNotAllowedMiddleware);

module.exports = router;

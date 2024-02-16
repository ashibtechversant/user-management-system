const express = require('express');
const adminController = require('../controllers/admin-controller');
const authMiddleware = require('../middleware/authentication-middleware');
const authorizationMiddleware = require('../middleware/authorization-middleware');
const methodNotAllowedMiddleware = require('../middleware/method-not-allowed-middleware');

const router = express.Router();

router.use(authMiddleware);
router.use(authorizationMiddleware('admin'));

router
  .route('/users')
  .get(adminController.getAllUsers)
  .post(adminController.registerUsers)
  .all(methodNotAllowedMiddleware);

router
  .route('/users/:userId')
  .get(adminController.getUser)
  .put(adminController.updateUser)
  .patch(adminController.updateUser)
  .delete(adminController.deleteUser)
  .all(methodNotAllowedMiddleware);

module.exports = router;

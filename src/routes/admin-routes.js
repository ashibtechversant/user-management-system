const express = require('express');
const adminController = require('../controllers/admin-controller');
const authMiddleware = require('../middleware/auth-middleware');
const adminAuthMiddleware = require('../middleware/admin-auth-middleware');
const methodNotAllowedMiddleware = require('../middleware/method-not-allowed-middleware');

const router = express.Router();

router.use(authMiddleware);
router.use(adminAuthMiddleware);

router
  .route('/users')
  .get(adminController.getAllUsers)
  .post(adminController.registerUsers)
  .all(methodNotAllowedMiddleware);

router
  .route('/users/:userId')
  .get(adminController.getUser)
  .delete(adminController.deleteUser)
  .put(adminController.updateUser)
  .patch(adminController.partialUpdateUser)
  .all(methodNotAllowedMiddleware);

module.exports = router;

const express = require('express');
const authMiddleware = require('../middleware/authentication-middleware');
const authorizationMiddleware = require('../middleware/authorization-middleware');
const methodNotAllowedMiddleware = require('../middleware/method-not-allowed-middleware');
const userController = require('../controllers/user-controller');
const pathVerificationMiddleware = require('../middleware/path-verification-middleware');

const router = express.Router();

router.use(authMiddleware);
router.use(authorizationMiddleware('supervisor'));

router
  .route('/:supervisorUserId/users')
  .get(userController.getAllUsers)
  .all(methodNotAllowedMiddleware);

router
  .route('/:supervisorUserId/users/:userId')
  .get(userController.getUser)
  .all(methodNotAllowedMiddleware);

router.param('supervisorUserId', pathVerificationMiddleware);

module.exports = router;

const express = require('express');

const router = express.Router();

const authController = require('../controllers/auth-controller');
const methodNotAllowedMiddleware = require('../middleware/method-not-allowed-middleware');

router
  .route('/login')
  .post(authController.login)
  .all(methodNotAllowedMiddleware);

router
  .route('/refresh-token')
  .post(authController.refreshToken)
  .all(methodNotAllowedMiddleware);

module.exports = router;

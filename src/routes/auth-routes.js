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

router
  .route('/forgot-password')
  .post(authController.forgotPassword)
  .all(methodNotAllowedMiddleware);

router
  .route('/otp')
  .post(authController.verifyOtp)
  .all(methodNotAllowedMiddleware);

router
  .route('/reset-password')
  .post(authController.resetPassword)
  .all(methodNotAllowedMiddleware);

module.exports = router;

const express = require('express');
const userController = require('../controllers/user-controller');
const authMiddleware = require('../middleware/auth-middleware');
const methodNotAllowedMiddleware = require('../middleware/method-not-allowed-middleware');

const router = express.Router();

router
  .route('/')
  .get(authMiddleware, userController.fetchUserDetails)
  .all(methodNotAllowedMiddleware);

module.exports = router;

const express = require('express');
const methodNotAllowedMiddleware = require('../middleware/method-not-allowed-middleware');
const agentController = require('../controllers/agent-controller');

const router = express.Router();

router
  .route('/')
  .post(agentController.registerAgent)
  .all(methodNotAllowedMiddleware);

module.exports = router;

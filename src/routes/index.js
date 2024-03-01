const express = require('express');
const methodNotAllowedMiddleware = require('../middleware/method-not-allowed-middleware');
const logger = require('../utils/winston-utils');
const responseFormatter = require('../utils/helpers/controllers/response-formatter');

const router = express.Router();

router
  .route('/status')
  .get((_, res) => {
    logger.info('checking the api status. everything is ok');
    res.json(responseFormatter('api is up and running'));
  })
  .all(methodNotAllowedMiddleware);

const authRouter = require('./auth-routes');
const adminRouter = require('./admin-routes');
const userRouter = require('./user-routes');
const agentRouter = require('./agent-routes');
const supervisorRouter = require('./supervisor-routes');

router.use('/auth', authRouter);
router.use('/admin', adminRouter);
router.use('/users', userRouter);
router.use('/agents', agentRouter);
router.use('/supervisor', supervisorRouter);

module.exports = router;

const express = require('express');
const methodNotAllowedMiddleware = require('../middleware/method-not-allowed-middleware');
const logger = require('../utils/winston-utils');

const router = express.Router();

router
  .route('/status')
  .get((_, res) => {
    logger.info('checking the api status. everything is ok');
    res.json({ status: 'true', message: 'api is up and running' });
  })
  .all(methodNotAllowedMiddleware);

const authRouter = require('./auth-routes');
const adminRouter = require('./admin-routes');
const userRouter = require('./user-routes');

router.use('/auth', authRouter);
router.use('/admin', adminRouter);
router.use('/users', userRouter);

module.exports = router;

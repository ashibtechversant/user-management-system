const express = require('express');
const methodNotAllowedMiddleware = require('../middleware/method-not-allowed-middleware');
const logger = require('../helpers/winston-helper');

const router = express.Router();

router
  .route('/status')
  .get((_, res) => {
    logger.info('checking the api status. everything is ok');
    res
      .status(200)
      .json({ status: 'up', message: 'api is working fine and running' });
  })
  .all(methodNotAllowedMiddleware);

const authRouter = require('./auth-routes');
const adminRouter = require('./admin-routes');
const userRouter = require('./user-routes');

router.use('/auth', authRouter);
router.use('/admin', adminRouter);
router.use('/user', userRouter);

module.exports = router;

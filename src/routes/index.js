const express = require('express');

const router = express.Router();

const methodNotAllowedMiddleware = require('../middleware/method-not-allowed-middleware');

router
  .route('/')
  .get((_, res) => {
    res.status(200).json({ status: 'ok', message: 'api is working' });
  })
  .all(methodNotAllowedMiddleware);

const authRouter = require('./auth-routes');
const adminRouter = require('./admin-routes');
const userRouter = require('./user-routes');

router.use('/auth', authRouter);
router.use('/admin', adminRouter);
router.use('/user', userRouter);

module.exports = router;

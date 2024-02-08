const createHttpError = require('http-errors');
const users = require('../data/users.json');

module.exports = {
  async fetchUserDetails(req, res, next) {
    try {
      const { userId } = req.payload;
      if (!userId) throw createHttpError.BadRequest('userId is missing');
      const user = users.find((e) => e.id === userId);
      if (!user) throw createHttpError.NotFound('user not found');
      res.json({
        status: 'ok',
        message: 'user details retrieved successfully',
        data: user,
      });
    } catch (error) {
      next(error);
    }
  },
};

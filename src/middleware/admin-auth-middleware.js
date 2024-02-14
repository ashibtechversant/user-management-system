const createHttpError = require('http-errors');
const users = require('../../data/users.json');

module.exports = async (req, _, next) => {
  try {
    const { userId } = req.payload;
    if (!userId) throw createHttpError.BadRequest('userId is missing');
    const user = users.find((e) => e.id === userId);
    if (!user) throw createHttpError.NotFound('user not found');
    const isAdmin = user.role === 'admin';
    if (!isAdmin) throw createHttpError.Forbidden('admin authorization failed');
    next();
  } catch (error) {
    next(error);
  }
};

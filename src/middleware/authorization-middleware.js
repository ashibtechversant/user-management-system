const createHttpError = require('http-errors');
const users = require('../../data/users.json');

module.exports = (role) => async (req, _, next) => {
  try {
    const { userId } = req.payload;
    if (!userId) throw createHttpError.Unauthorized('invalid token');
    const user = users.find((e) => e.id === userId);
    if (!user) throw createHttpError.NotFound('user not found');
    const isRole = user.role === role;
    if (!isRole)
      throw createHttpError.Forbidden(`${role} authorization failed`);
    next();
  } catch (error) {
    next(error);
  }
};

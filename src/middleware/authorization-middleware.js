const createHttpError = require('http-errors');
const { readUserWithId } = require('../utils/data/manage-users');

module.exports = (role) => async (req, _, next) => {
  try {
    const { userId } = req.payload;
    if (!userId) throw createHttpError.Unauthorized('invalid token');
    const user = await readUserWithId(userId);
    const isRole = user.role === role;
    if (!isRole)
      throw createHttpError.Forbidden(`${role} authorization failed`);
    next();
  } catch (error) {
    next(error);
  }
};

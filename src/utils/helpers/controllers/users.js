const createHttpError = require('http-errors');
const users = require('../../../../data/users.json');

module.exports = {
  validateUser(userId) {
    const id = Number(userId);
    if (Number.isNaN(id))
      throw createHttpError.BadRequest('user id is not a number');
    const userIndex = users.findIndex((user) => user.id === id);
    if (userIndex === -1) throw createHttpError.NotFound('user not found');
    const user = users[userIndex];
    return { user, userIndex };
  },
  handleDuplicateEmail(email) {
    const isEmailAlreadyRegistered = users.some((e) => e.email === email);
    if (isEmailAlreadyRegistered)
      throw createHttpError.Conflict(`${email} has already been registered`);
  },
  validateUserId(payloadUserId, paramsUserId) {
    const numParamsUserId = Number(paramsUserId);
    if (Number.isNaN(numParamsUserId))
      throw createHttpError.BadRequest('user id is not a number');
    if (!payloadUserId)
      throw createHttpError.InternalServerError('user id is missing');
    if (payloadUserId !== numParamsUserId)
      throw createHttpError.Forbidden(
        'you are not authorized to access this page'
      );
  },
};

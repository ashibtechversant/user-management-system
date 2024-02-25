const createHttpError = require('http-errors');
const users = require('../../../../../data/users.json');

module.exports = (userId) => {
  const id = Number(userId);
  if (Number.isNaN(id))
    throw createHttpError.BadRequest('invalid userId in path');
  const userIndex = users.findIndex((user) => user.id === id);
  if (userIndex === -1) throw createHttpError.NotFound('user not found');
  const user = users[userIndex];
  return { user, userIndex };
};

const createHttpError = require('http-errors');
const { readAllUsers } = require('../../data/manage-users');

module.exports = async (email) => {
  const users = await readAllUsers();
  const foundUser = users.find((user) => user.email === email);
  if (!foundUser) throw createHttpError.NotFound('no user found');
  return foundUser;
};

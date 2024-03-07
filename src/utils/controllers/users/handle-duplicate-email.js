const createHttpError = require('http-errors');
const { readAllUsers } = require('../../data/manage-users');

module.exports = async (email) => {
  const users = await readAllUsers();
  const isEmailAlreadyRegistered = users.some((e) => e.email === email);
  if (isEmailAlreadyRegistered)
    throw createHttpError.Conflict(`${email} has already been registered`);
};

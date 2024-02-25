const createHttpError = require('http-errors');
const users = require('../../../../../data/users.json');

module.exports = (email) => {
  const isEmailAlreadyRegistered = users.some((e) => e.email === email);
  if (isEmailAlreadyRegistered)
    throw createHttpError.Conflict(`${email} has already been registered`);
};

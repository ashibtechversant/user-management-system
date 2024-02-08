const createHttpError = require('http-errors');
const users = require('../data/users.json');
const registrationSchema = require('../schemas/registration-schema');
const updateSchema = require('../schemas/update-schema');
const { hashPassword } = require('../utils/bcrypt-utils');

function handleJoiError(error, next) {
  if (error.isJoi) next(createHttpError.UnprocessableEntity());
  else next(error);
}

function validateUser(userId) {
  const id = Number(userId);
  if (!id) throw createHttpError.BadRequest();
  const userIndex = users.findIndex((user) => user.id === id);
  if (userIndex === -1) throw createHttpError.NotFound('user not found');
  const user = users[userIndex];
  return { user, userIndex };
}

function handleDuplicateEmail(email) {
  const isEmailAlreadyRegistered = users.some((e) => e.email === email);
  if (isEmailAlreadyRegistered)
    throw createHttpError.Conflict(`${email} has already been registered`);
}

module.exports = {
  async registerUsers(req, res, next) {
    try {
      const result = await registrationSchema.validateAsync(req.body);
      handleDuplicateEmail(result.email);
      const hashedPassword = await hashPassword(result.password);
      const finalResult = {
        id: users.length + 1,
        ...result,
        password: hashedPassword,
      };
      users.push(finalResult);
      res.status(201).json({
        status: 'created',
        message: 'registration successful',
        data: {
          user: finalResult,
        },
      });
    } catch (error) {
      handleJoiError(error, next);
    }
  },

  async getAllUsers(_, res, next) {
    try {
      res.json({
        status: 'ok',
        message: 'users retrieved successfully',
        data: {
          users,
        },
      });
    } catch (error) {
      next(error);
    }
  },

  async getUser(req, res, next) {
    try {
      const { userId } = req.params;
      const { user } = validateUser(userId);
      res.json({
        status: 'ok',
        message: 'user details retrieved successfully',
        data: user,
      });
    } catch (error) {
      next(error);
    }
  },

  async deleteUser(req, res, next) {
    try {
      const { userId } = req.params;
      const { userIndex } = validateUser(userId);
      users.splice(userIndex, 1);
      res.json({ status: 'ok', message: 'user deleted successfully' });
    } catch (error) {
      next(error);
    }
  },

  async updateUser(req, res, next) {
    try {
      const { method } = req;
      const { userId } = req.params;
      const { user, userIndex } = validateUser(userId);
      const schema = method === 'PUT' ? registrationSchema : updateSchema;
      const result = await schema.validateAsync(req.body);
      if (result.email && result.email !== user.email)
        handleDuplicateEmail(result.email);
      if (result.password)
        result.password = await hashPassword(result.password);
      const finalResult =
        method === 'PUT'
          ? { id: userIndex + 1, ...result }
          : { ...user, ...result };
      users.splice(userIndex, 1, finalResult);
      res.json({
        status: 'ok',
        message: 'user updated successfully',
        data: { user: finalResult },
      });
    } catch (error) {
      handleJoiError(error, next);
    }
  },
};

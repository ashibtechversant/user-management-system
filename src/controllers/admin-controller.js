const createHttpError = require('http-errors');
const users = require('../data/users.json');
const registrationSchema = require('../schemas/registration-schema');
const updateSchema = require('../schemas/update-schema');
const { hashPassword } = require('../utils/bcrypt-utils');

module.exports = {
  async registerUsers(req, res, next) {
    try {
      const result = await registrationSchema.validateAsync(req.body);
      const isEmailAlreadyRegistered = users.find(
        (user) => user.email === result.email
      );
      if (isEmailAlreadyRegistered)
        throw createHttpError.Conflict(
          `${result.email} has already been registered`
        );
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
      if (error.isJoi) error.status = 422;
      next(error);
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
      let { userId } = req.params;
      userId = Number(userId);
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

  async deleteUser(req, res, next) {
    try {
      let { userId } = req.params;
      userId = Number(userId);
      if (!userId) throw createHttpError.BadRequest('userId is missing');
      const userIndex = users.findIndex((user) => user.id === userId);
      if (userIndex === -1) throw createHttpError.NotFound('user not found');
      users.splice(userIndex, 1);
      res.json({ status: 'ok', message: 'user deleted successfully' });
    } catch (error) {
      next(error);
    }
  },

  async updateUser(req, res, next) {
    try {
      let { userId } = req.params;
      userId = Number(userId);
      if (!userId) throw createHttpError.BadRequest('userId is missing');
      const userIndex = users.findIndex((user) => user.id === userId);
      if (userIndex === -1) throw createHttpError.NotFound('user not found');
      const result = await registrationSchema.validateAsync(req.body);
      const hashedPassword = await hashPassword(result.password);
      const finalResult = { id: userId, ...result, password: hashedPassword };
      users.splice(userIndex, 1, finalResult);
      res.json({
        status: 'ok',
        message: 'user updated successfully',
        data: { user: finalResult },
      });
    } catch (error) {
      next(error);
    }
  },

  async partialUpdateUser(req, res, next) {
    try {
      let { userId } = req.params;
      userId = Number(userId);
      if (!userId) throw createHttpError.BadRequest('userId is missing');
      const user = users.find((e) => e.id === userId);
      console.log(user);
      if (!user) throw createHttpError.NotFound('user not found');
      const result = await updateSchema.validateAsync(req.body);
      if (result.password)
        result.password = await hashPassword(result.password);
      const finalResult = { ...user, ...result };
      users.splice(userId - 1, 1, finalResult);
      res.json({
        status: 'ok',
        message: 'user updated successfully',
        data: { user: finalResult },
      });
    } catch (error) {
      next(error);
    }
  },
};

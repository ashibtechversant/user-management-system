const users = require('../../data/users.json');
const registrationSchema = require('../schemas/registration-schema');
const adminUserUpdateSchema = require('../schemas/admin-user-update-schema');
const { hashPassword } = require('../utils/bcrypt-utils');
const {
  handleDuplicateEmail,
  validateUser,
} = require('../utils/helpers/controllers/users');
const handleJoiError = require('../utils/helpers/controllers/handle-joi-error');
const writeUsers = require('../utils/helpers/data/write-users');

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
      await writeUsers(users);
      res.status(201).json({
        status: 'true',
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
        status: 'true',
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
        status: 'true',
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
      await writeUsers(users);
      res.json({ status: 'true', message: 'user deleted successfully' });
    } catch (error) {
      next(error);
    }
  },

  async updateUser(req, res, next) {
    try {
      const { method } = req;
      const { userId } = req.params;
      const { user, userIndex } = validateUser(userId);
      const schema =
        method === 'PUT' ? registrationSchema : adminUserUpdateSchema;
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
      await writeUsers(users);
      res.json({
        status: 'true',
        message: 'user updated successfully',
        data: { user: finalResult },
      });
    } catch (error) {
      handleJoiError(error, next);
    }
  },
};

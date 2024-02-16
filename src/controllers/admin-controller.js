const users = require('../../data/users.json');
const registrationSchema = require('../schemas/registration-schema');
const adminUserUpdateSchema = require('../schemas/admin-user-update-schema');
const responseFormatter = require('../utils/helpers/controllers/response-formatter');
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
      res
        .status(201)
        .json(
          responseFormatter('registration successful', { user: finalResult })
        );
    } catch (error) {
      handleJoiError(error, next);
    }
  },

  async getAllUsers(_, res, next) {
    try {
      res.json(responseFormatter('users retrieved successfully', { users }));
    } catch (error) {
      next(error);
    }
  },

  async getUser(req, res, next) {
    try {
      const { userId } = req.params;
      const { user } = validateUser(userId);
      res.json(
        responseFormatter('user details retrieved successfully', { user })
      );
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
      res.json(responseFormatter('user deleted successfully'));
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
      if (JSON.stringify(user) === JSON.stringify(finalResult))
        return res.json(
          responseFormatter('no changes were found for updation', {
            user,
          })
        );
      users.splice(userIndex, 1, finalResult);
      await writeUsers(users);
      return res.json(
        responseFormatter('user updated successfully', { user: finalResult })
      );
    } catch (error) {
      return handleJoiError(error, next);
    }
  },
};

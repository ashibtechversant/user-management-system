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
      const registrationData = await registrationSchema.validateAsync(req.body);
      handleDuplicateEmail(registrationData.email);
      const hashedPassword = await hashPassword(registrationData.password);
      const newUser = {
        id: users.length + 1,
        ...registrationData,
        password: hashedPassword,
      };
      users.push(newUser);
      await writeUsers(users);
      res
        .status(201)
        .json(responseFormatter('registration successful', { user: newUser }));
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
      const updationData = await schema.validateAsync(req.body);
      if (updationData.email && updationData.email !== user.email)
        handleDuplicateEmail(updationData.email);
      if (updationData.password)
        updationData.password = await hashPassword(updationData.password);
      const updatedUser =
        method === 'PUT'
          ? { id: userIndex + 1, ...updationData }
          : { ...user, ...updationData };
      if (JSON.stringify(user) === JSON.stringify(updatedUser))
        return res.json(
          responseFormatter('no changes were found for updation', {
            user,
          })
        );
      users.splice(userIndex, 1, updatedUser);
      await writeUsers(users);
      return res.json(
        responseFormatter('user updated successfully', { user: updatedUser })
      );
    } catch (error) {
      return handleJoiError(error, next);
    }
  },
};

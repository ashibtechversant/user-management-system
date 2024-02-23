const createHttpError = require('http-errors');
const users = require('../../data/users.json');
const {
  validateUser,
  validateUserId,
} = require('../utils/helpers/controllers/users');
const handleJoiError = require('../utils/helpers/controllers/handle-joi-error');
const updateSchema = require('../schemas/update-schema');
const updatePartialSchema = require('../schemas/update-partial-schema');
const passwordSchema = require('../schemas/password-schema');
const { hashPassword, checkPassword } = require('../utils/bcrypt-utils');
const writeUsers = require('../utils/helpers/data/write-users');
const responseFormatter = require('../utils/helpers/controllers/response-formatter');

module.exports = {
  async getUser(req, res, next) {
    try {
      const { userId: payloadUserId } = req.payload;
      const { userId: paramsUserId } = req.params;
      validateUserId(payloadUserId, paramsUserId);
      const user = users.find((e) => e.id === payloadUserId);
      if (!user) throw createHttpError.NotFound('user not found');
      res.json(
        responseFormatter('user details retrieved successfully', { user })
      );
    } catch (error) {
      next(error);
    }
  },

  async updateUser(req, res, next) {
    try {
      const { method } = req;
      const { userId: paramsUserId } = req.params;
      const { userId: payloadUserId } = req.payload;
      const { user, userIndex } = validateUser(paramsUserId);
      validateUserId(payloadUserId, paramsUserId);
      const schema = method === 'PUT' ? updateSchema : updatePartialSchema;
      const updationData = await schema.validateAsync(req.body);
      const updatedUser =
        method === 'PUT'
          ? { id: userIndex + 1, ...updationData }
          : { ...user, ...updationData };
      if (JSON.stringify(user) === JSON.stringify(updatedUser))
        return res.json(
          responseFormatter('no changes were found for updation', { user })
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

  async changePassword(req, res, next) {
    try {
      const { userId: paramsUserId } = req.params;
      const { userId: payloadUserId } = req.payload;
      validateUserId(payloadUserId, paramsUserId);
      const passwordData = await passwordSchema.validateAsync(req.body);
      const { user, userIndex } = validateUser(payloadUserId);
      const isPasswordValid = await checkPassword(
        passwordData.currentPassword,
        user.password
      );
      if (!isPasswordValid)
        throw createHttpError.BadRequest('incorrect password');
      const hashedPassword = await hashPassword(passwordData.newPassword);
      const updatedUser = { ...user, password: hashedPassword };
      if (hashedPassword === user.password)
        return res.json(
          responseFormatter('no changes were made to the password', { user })
        );
      users.splice(userIndex, 1, updatedUser);
      await writeUsers(users);
      return res.json(
        responseFormatter('password updated successfully', {
          user: updatedUser,
        })
      );
    } catch (error) {
      return handleJoiError(error, next);
    }
  },

  async uploadImage(req, res, next) {
    try {
      const { file } = req;
      res.json(responseFormatter('file uploaded successfully', { file }));
    } catch (error) {
      next(error);
    }
  },
};

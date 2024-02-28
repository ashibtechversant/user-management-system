const createHttpError = require('http-errors');
const convertUserIdInPath = require('../utils/helpers/controllers/convert-user-id-in-path');
const handleJoiError = require('../utils/helpers/controllers/handle-joi-error');
const updateSchema = require('../schemas/update-schema');
const updatePartialSchema = require('../schemas/update-partial-schema');
const passwordSchema = require('../schemas/password-schema');
const { hashPassword, checkPassword } = require('../utils/bcrypt-utils');
const responseFormatter = require('../utils/helpers/controllers/response-formatter');
const {
  readUserWithId,
  updateUserWithId,
  readAllUsers,
} = require('../utils/helpers/data/manage-users');

module.exports = {
  async getUser(req, res, next) {
    try {
      const { userId: paramsUserId } = req.params;
      const convertedUserId = convertUserIdInPath(paramsUserId);
      const user = await readUserWithId(convertedUserId);
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
      convertUserIdInPath(paramsUserId);
      const schema = method === 'PUT' ? updateSchema : updatePartialSchema;
      const updationData = await schema.validateAsync(req.body);
      const user = await readUserWithId(payloadUserId);
      const updatedUser = await updateUserWithId(payloadUserId, updationData);
      if (JSON.stringify(user) === JSON.stringify(updatedUser))
        return res.json(
          responseFormatter('no changes were found for updation', { user })
        );
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
      convertUserIdInPath(paramsUserId);
      const passwordData = await passwordSchema.validateAsync(req.body);
      const user = await readUserWithId(payloadUserId);
      const isPasswordValid = await checkPassword(
        passwordData.currentPassword,
        user.password
      );
      if (!isPasswordValid)
        throw createHttpError.BadRequest('incorrect password');
      const hashedPassword = await hashPassword(passwordData.newPassword);
      if (hashedPassword === user.password)
        return res.json(
          responseFormatter('no changes were made to the password', { user })
        );
      const updationData = { password: hashedPassword };
      const updatedUser = await updateUserWithId(payloadUserId, updationData);
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

  async getAllUsers(_, res, next) {
    try {
      const users = await readAllUsers();
      res.json(responseFormatter('users retrieved successfully', { users }));
    } catch (error) {
      next(error);
    }
  },
};

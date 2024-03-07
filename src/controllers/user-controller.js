const createHttpError = require('http-errors');
const convertUserIdInPath = require('../utils/controllers/convert-user-id-in-path');
const handleJoiError = require('../utils/controllers/handle-joi-error');
const updateSchema = require('../schemas/update-schema');
const updatePartialSchema = require('../schemas/update-partial-schema');
const passwordSchema = require('../schemas/password-schema');
const { hashPassword, checkPassword } = require('../utils/bcrypt-utils');
const responseFormatter = require('../utils/controllers/response-formatter');
const {
  readUserWithId,
  updateUserWithId,
  readAllUsers,
} = require('../utils/data/manage-users');
const applyPagination = require('../utils/controllers/users/apply-pagination');
const applySearch = require('../utils/controllers/users/apply-search');

module.exports = {
  async getUser(req, res, next) {
    try {
      const { userId } = req.params;
      const convertedUserId = convertUserIdInPath(userId);
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
      const { userId } = req.payload;
      const schema = method === 'PUT' ? updateSchema : updatePartialSchema;
      const updationData = await schema.validateAsync(req.body);
      const user = await readUserWithId(userId);
      const updatedUser = await updateUserWithId(userId, updationData);
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
      const { userId } = req.payload;
      const passwordData = await passwordSchema.validateAsync(req.body);
      const user = await readUserWithId(userId);
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
      const updatedUser = await updateUserWithId(userId, updationData);
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

  async getAllUsers(req, res, next) {
    try {
      const users = await readAllUsers();
      const { page, limit, search } = req.query;
      const searchResult = await applySearch(users, search);
      const paginatedResult = await applyPagination(searchResult, page, limit);
      res.json(
        responseFormatter('users retrieved successfully', paginatedResult)
      );
    } catch (error) {
      next(error);
    }
  },

  async getUserProfile(req, res, next) {
    try {
      const { userId } = req.payload;
      const user = await readUserWithId(userId);
      res.json(
        responseFormatter('user details retrieved successfully', { user })
      );
    } catch (error) {
      next(error);
    }
  },
};

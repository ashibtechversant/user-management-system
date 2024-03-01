const createHttpError = require('http-errors');
const registrationSchema = require('../schemas/registration-schema');
const adminUserUpdateSchema = require('../schemas/admin-user-update-schema');
const responseFormatter = require('../utils/helpers/controllers/response-formatter');
const { hashPassword } = require('../utils/bcrypt-utils');
const handleDuplicateEmail = require('../utils/helpers/controllers/users/handle-duplicate-email');
const convertUserIdInPath = require('../utils/helpers/controllers/convert-user-id-in-path');
const handleJoiError = require('../utils/helpers/controllers/handle-joi-error');
const {
  createUser,
  deleteUserWithId,
  readUserWithId,
  updateUserWithId,
} = require('../utils/helpers/data/manage-users');

module.exports = {
  async registerUsers(req, res, next) {
    try {
      const registrationData = await registrationSchema.validateAsync(req.body);
      await handleDuplicateEmail(registrationData.email);
      const password = await hashPassword(registrationData.password);
      const newUser = {
        ...registrationData,
        password,
      };
      const createdUser = await createUser(newUser);
      res
        .status(201)
        .json(
          responseFormatter('registration successful', { user: createdUser })
        );
    } catch (error) {
      handleJoiError(error, next);
    }
  },

  async deleteUser(req, res, next) {
    try {
      const { userId } = req.params;
      const convertedUserId = convertUserIdInPath(userId);
      const user = await readUserWithId(convertedUserId);
      if (user.role === 'admin')
        throw createHttpError.Forbidden('cannot delete admin');
      await deleteUserWithId(convertedUserId);
      res.json(responseFormatter('user deleted successfully'));
    } catch (error) {
      next(error);
    }
  },

  async updateUser(req, res, next) {
    try {
      const { method } = req;
      const { userId } = req.params;
      const convertedUserId = convertUserIdInPath(userId);
      const schema =
        method === 'PUT' ? registrationSchema : adminUserUpdateSchema;
      const updationData = await schema.validateAsync(req.body);
      const user = await readUserWithId(convertedUserId);
      if (updationData.email && updationData.email !== user.email)
        await handleDuplicateEmail(updationData.email);
      if (updationData.password)
        updationData.password = await hashPassword(updationData.password);
      const updatedUser = await updateUserWithId(convertedUserId, updationData);
      if (JSON.stringify(user) === JSON.stringify(updatedUser))
        return res.json(
          responseFormatter('no changes were found for updation', {
            user,
          })
        );
      return res.json(
        responseFormatter('user updated successfully', { user: updatedUser })
      );
    } catch (error) {
      return handleJoiError(error, next);
    }
  },
};

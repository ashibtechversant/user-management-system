const createHttpError = require('http-errors');
const users = require('../data/users.json');
const {
  validateUser,
  validateUserId,
} = require('../utils/helpers/controllers/users');
const handleJoiError = require('../utils/helpers/controllers/handle-joi-error');
const updateSchema = require('../schemas/update-schema');
const updatePartialSchema = require('../schemas/update-partial-schema');
const passwordSchema = require('../schemas/password-schema');
const { hashPassword } = require('../utils/bcrypt-utils');

module.exports = {
  async getUser(req, res, next) {
    try {
      const { userId: payloadUserId } = req.payload;
      const { userId: paramsUserId } = req.params;
      validateUserId(payloadUserId, paramsUserId);
      const user = users.find((e) => e.id === payloadUserId);
      if (!user) throw createHttpError.NotFound('user not found');
      res.json({
        status: 'true',
        message: 'user details retrieved successfully',
        data: user,
      });
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
      const result = await schema.validateAsync(req.body);
      const finalResult =
        method === 'PUT'
          ? { id: userIndex + 1, ...result }
          : { ...user, ...result };
      users.splice(userIndex, 1, finalResult);
      res.json({
        status: 'true',
        message: 'user updated successfully',
        data: { user: finalResult },
      });
    } catch (error) {
      handleJoiError(error, next);
    }
  },
  async changePassword(req, res, next) {
    try {
      const { userId: paramsUserId } = req.params;
      const { userId: payloadUserId } = req.payload;
      validateUserId(payloadUserId, paramsUserId);
      const result = await passwordSchema.validateAsync(req.body);
      const hashedPassword = await hashPassword(result.newPassword);
      const { user, userIndex } = validateUser(payloadUserId);
      const finalResult = { ...user, password: hashedPassword };
      users.splice(userIndex, 1, finalResult);
      res.json({
        status: 'true',
        message: 'password updated successfully',
        data: { user: finalResult },
      });
    } catch (error) {
      handleJoiError(error, next);
    }
  },
};

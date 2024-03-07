const agentRegistrationSchema = require('../schemas/agent-registration-schema');
const { hashPassword } = require('../utils/bcrypt-utils');
const handleJoiError = require('../utils/controllers/handle-joi-error');
const responseFormatter = require('../utils/controllers/response-formatter');
const handleDuplicateEmail = require('../utils/controllers/users/handle-duplicate-email');
const { createUser } = require('../utils/data/manage-users');

module.exports = {
  async registerAgent(req, res, next) {
    try {
      const registrationData = await agentRegistrationSchema.validateAsync(
        req.body
      );
      await handleDuplicateEmail(registrationData.email);
      const role = 'agent';
      const password = await hashPassword(registrationData.password);
      const newUser = {
        ...registrationData,
        role,
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
};

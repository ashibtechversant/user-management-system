const Joi = require('joi');

module.exports = Joi.object({
  fullName: Joi.string().min(3),
  role: Joi.string().valid('admin', 'user'),
  profilePictureUrl: Joi.string(),
});

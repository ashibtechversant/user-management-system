const Joi = require('joi');

module.exports = Joi.object({
  email: Joi.string().email().lowercase().required(),
  otp: Joi.number().integer().min(6).max(6),
});

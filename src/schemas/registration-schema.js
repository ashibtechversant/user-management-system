const Joi = require('joi');

module.exports = Joi.object({
  fullName: Joi.string().min(3).required(),
  email: Joi.string().email().lowercase().required(),
  role: Joi.string().valid('admin', 'user').required(),
  password: Joi.string()
    .min(8)
    .pattern(/^[a-zA-Z0-9]{3,30}$/)
    .required(),
});

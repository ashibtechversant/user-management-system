const Joi = require('joi');

module.exports = Joi.object({
  fullName: Joi.string().min(3),
  email: Joi.string().email().lowercase(),
  role: Joi.string().valid('admin', 'agent', 'supervisor', 'qc', 'qa'),
  profilePictureUrl: Joi.string(),
  password: Joi.string()
    .min(8)
    .pattern(/^[a-zA-Z0-9]{3,30}$/),
});

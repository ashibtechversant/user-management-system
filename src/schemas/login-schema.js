const Joi = require('joi');

module.exports = Joi.object({
  email: Joi.string().email().lowercase().required(),
  password: Joi.string()
    .min(8)
    .pattern(/^[a-zA-Z0-9]{8,30}$/)
    .required(),
});

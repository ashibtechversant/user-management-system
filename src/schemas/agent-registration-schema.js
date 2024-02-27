const Joi = require('joi');

module.exports = Joi.object({
  firstName: Joi.string()
    .pattern(/^[a-zA-Z ]+$/)
    .required(),
  lastName: Joi.string()
    .pattern(/^[a-zA-Z ]+$/)
    .required(),
  email: Joi.string().email().lowercase().required(),
  password: Joi.string()
    .min(8)
    .pattern(/^[a-zA-Z0-9]{8,30}$/)
    .required(),
});

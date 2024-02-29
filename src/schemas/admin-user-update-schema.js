const Joi = require('joi');

module.exports = Joi.object({
  firstName: Joi.string().pattern(/^[a-zA-Z ]+$/),
  lastName: Joi.string().pattern(/^[a-zA-Z ]+$/),
  email: Joi.string().email().lowercase(),
  role: Joi.string().valid('agent', 'supervisor', 'qc', 'qa'),
  password: Joi.string()
    .min(8)
    .pattern(/^[a-zA-Z0-9]{8,30}$/),
});

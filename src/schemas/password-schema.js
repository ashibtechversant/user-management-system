const Joi = require('joi');

module.exports = Joi.object({
  currentPassword: Joi.string()
    .min(8)
    .pattern(/^[a-zA-Z0-9]{3,30}$/)
    .required(),
  newPassword: Joi.string()
    .min(8)
    .pattern(/^[a-zA-Z0-9]{3,30}$/)
    .required(),
  confirmPassword: Joi.string().valid(Joi.ref('newPassword')).required(),
});
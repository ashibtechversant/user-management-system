const Joi = require('joi');

module.exports = Joi.object({
  otpToken: Joi.string().required(),
  newPassword: Joi.string()
    .min(8)
    .pattern(/^[a-zA-Z0-9]{8,30}$/)
    .required(),
  confirmPassword: Joi.string().valid(Joi.ref('newPassword')).required(),
});

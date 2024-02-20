const Joi = require('joi');

module.exports = Joi.object({
  firstName: Joi.string()
    .pattern(/^[a-zA-Z ]+$/)
    .required(),
  lastName: Joi.string()
    .pattern(/^[a-zA-Z ]+$/)
    .required(),
  profilePictureUrl: Joi.string(),
});

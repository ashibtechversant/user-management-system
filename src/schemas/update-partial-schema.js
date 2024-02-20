const Joi = require('joi');

module.exports = Joi.object({
  firstName: Joi.string().pattern(/^[a-zA-Z ]+$/),
  lastName: Joi.string().pattern(/^[a-zA-Z ]+$/),
  profilePictureUrl: Joi.string(),
});

const Joi = require('joi');

module.exports = Joi.object({
  fullName: Joi.string().min(3).required(),
  role: Joi.string().label('Role').valid('admin', 'user').required(),
});

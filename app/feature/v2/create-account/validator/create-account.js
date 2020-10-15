const Joi = require("joi");

const schema = Joi.object().keys({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  full_name: Joi.string().required(),
  last_name: Joi.string().required(),
  first_name: Joi.string().required(),
});

module.exports = schema;
const Joi = require("joi");

const schema = Joi.object().keys({
  email: Joi.string().email({
    minDomainAtoms: 2
  }).required(),
  password: Joi.string()
    .regex(/^[a-zA-Z0-9!@#$%^&*()-_=+]{6,30}$/)
    .required(),
  phone: Joi.string().optional().allow(""),
  referrer_code: Joi.string().optional().allow(""),
  language: Joi.string().optional().allow("")
});

module.exports = schema;
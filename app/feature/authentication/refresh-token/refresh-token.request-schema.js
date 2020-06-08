const Joi = require('joi');

const schema = Joi.object().keys({
  refresh_token: Joi.string().required()
});

module.exports = schema;
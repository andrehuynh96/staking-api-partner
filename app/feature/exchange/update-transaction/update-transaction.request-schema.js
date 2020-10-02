const Joi = require('joi');

const schema = Joi.object().keys({
  tx_id: Joi.string().required(),
  device_code: Joi.string().required(),
});

module.exports = schema;
const Joi = require("joi");
const config = require("app/config");

const schema = Joi.object().keys({
  voter_address: Joi.string().required(),
  tx_id: Joi.string().required(),
  memo: Joi.string().required(),
})

module.exports = schema;
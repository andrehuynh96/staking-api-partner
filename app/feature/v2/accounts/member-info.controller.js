const mapper = require('app/feature/response-schema/members/member.response-schema');
const Member = require('app/model/wallet').members;
const requestSchema = require('./validator/member-info.schema');
const logger = require("app/lib/logger");
const joi = require("joi");

module.exports = async (req, res, next) => {
  const result = joi.validate(req.query, requestSchema);
  if (result.error) {
    logger.error(result.error);
    return res.badRequest("Missing parameters");
  }

  let member = await Member.findOne({
    where: {
      email: req.query.email
    }
  });

  if (!member) {
    return res.notFound(res.__("MEMBER_NOT_FOUND"), "MEMBER_NOT_FOUND", { fields: ["email"] });
  }

  return res.ok(mapper(member));
}
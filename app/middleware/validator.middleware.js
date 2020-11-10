const joi = require("joi");

module.exports = function (schema) {
  return function (req, res, next) {
    const result = joi.validate(req.body, schema);
    if (result.error) {
      return res.badRequest("Missing parameters");
    } else {
      next();
    }
  };
};

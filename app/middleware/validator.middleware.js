const joi = require("joi");

module.exports = function (schema) {
  return function (req, res, next) {
    const result = joi.validate(req.body, schema);
    if (result.error) {
      const err = {
        details: result.error.details,
      };

      return res.badRequest("Missing parameters", 'MISSING_PARAMETERS', err);
    }

    next();
  };
};

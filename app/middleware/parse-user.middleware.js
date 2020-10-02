const config = require("app/config");
const key = require('app/lib/staking-api/key');
const jwt = require("jsonwebtoken");

module.exports = async function (req, res, next) {
  let token = req.headers["x-access-token"] || req.headers["authorization"];
  if (token && (token.toLowerCase().startsWith("bearer"))) {
    token = token.replace(/bearer/i, '').trim();
  }

  if (token) {
    try {
      var legit = jwt.verify(token, config.token.key.public);
      req.user = legit;
    } catch (err) {
      return res.badRequest(res.__("TOKEN_INVALID"), "TOKEN_INVALID", {
        fields: ['authorization'],
      });
    }
  }
  return next();
}

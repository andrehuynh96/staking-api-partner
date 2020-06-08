const config = require("app/config");
const key = require('app/lib/staking-api/key');
const jwt = require("jsonwebtoken");

module.exports = async function (req, res, next) {
  let token = req.headers["x-access-token"] || req.headers["authorization"];
  if (token && (token.toLowerCase().startsWith("bearer "))) {
    token = token.slice(7, token.length);
  }
  else {
    return res.unauthorized();
  }

  if (token) {
    try {
      var legit = jwt.verify(token, config.token.key.public);
      req.user = legit;
      return next();
    } catch (err) {
      return res.unauthorized();
    }
  }
}

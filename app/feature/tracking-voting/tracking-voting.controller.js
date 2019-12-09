const logger = require("app/lib/logger");
const config = require("app/config");

module.exports = async (req, res, next) => {
  try {

    return res.serverInternalError();
  }
  catch (err) {
    logger.error("tracking voting fail:", err);
    next(err);
  }
}
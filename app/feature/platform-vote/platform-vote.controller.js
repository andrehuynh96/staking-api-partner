const logger = require("app/lib/logger");
const config = require("app/config");
const StakingAPI = require("app/lib/staking-api")

module.exports = async (req, res, next) => {
  try {
    let items = await StakingAPI.platformVote();
    return res.status(items.httpCode).send(items.data);

  }
  catch (err) {
    logger.error("get platform vote fail:", err);
    next(err);
  }
}
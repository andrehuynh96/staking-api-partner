const logger = require("app/lib/logger");
const config = require("app/config");
const StakingAPI = require("app/lib/staking-api")

module.exports = async (req, res, next) => {
  try {
    let result = await StakingAPI.trackingVote({
      tx_id: req.body.tx_id,
      voter_address: req.body.voter_address,
      memo: req.body.memo
    });
    if (result.data) {
      return res.ok(true);
    }
    else {
      return res.badRequest(result.message);
    }
  }
  catch (err) {
    logger.error("tracking voting fail:", err);
    next(err);
  }
}
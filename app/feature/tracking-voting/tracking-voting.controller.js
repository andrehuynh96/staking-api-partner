const logger = require("app/lib/logger");
const config = require("app/config");
const StakingAPI = require("app/lib/staking-api")

module.exports = {
  track: async (req, res, next) => {
    try {
      let result = await StakingAPI.trackingVote({
        tx_id: req.body.tx_id,
        voter_address: req.body.voter_address,
        memo: req.body.memo,
        type: req.body.type,
        amount: req.body.amount
      });
      return res.status(result.httpCode).send(result.data);
    }
    catch (err) {
      logger.error("tracking voting fail:", err);
      next(err);
    }
  },
  track3rd: async (req, res, next) => {
    try {
      let result = await StakingAPI.trackingVote3rd({
        tx_id: req.body.tx_id,
        voter_address: req.body.voter_address,
        memo: req.body.memo,
        type: req.body.type,
        amount: req.body.amount
      });
      return res.status(result.httpCode).send(result.data);
    }
    catch (err) {
      logger.error("tracking voting 3rd party fail:", err);
      next(err);
    }
  }
}
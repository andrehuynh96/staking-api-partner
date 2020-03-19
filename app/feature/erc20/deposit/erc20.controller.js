
const logger = require("app/lib/logger");
const StakingAPI = require("app/lib/staking-api")

async function getDeposit(req, res, next) {
  try {
    var depositor_address = req.query.depositor_address;
    var deposit_id = req.query.deposit_id;
    var token_address = req.query.token_address;
    var pool_id = req.query.pool_id;
    var plan_id = req.query.plan_id;
    var partner_id = req.query.partner_id;
    var offset = req.query.offset;
    var limit = req.query.limit;
    var params = {
      depositor_address,
      deposit_id,
      token_address,
      pool_id,
      plan_id,
      partner_id,
      offset,
      limit,
    }
    let items = await StakingAPI.getERC20Deposit(params);
    if (items.data) {
      return res.ok(items.data);
    }
    else {
      return res.ok([]);
    }
  }
  catch (err) {
    logger.error("get deposit fail:", err);
    next(err);
  }
}

async function getHistoryOfAddress(req, res, next) {
  try {
    var depositor_address = req.query.depositor_address;
    var token_address = req.query.token_address;
    var offset = req.query.offset;
    var limit = req.query.limit;
    var params = {
      depositor_address,
      token_address,
      offset,
      limit,
    }
    let items = await StakingAPI.getERC20History(params);
    if (items.data) {
      return res.ok(items.data);
    }
    else {
      return res.ok([]);
    }
  }
  catch (err) {
    logger.error("get history fail:", err);
    next(err);
  }
}
async function getAddressAggregation(req, res, next) {
  try {
    var depositor_address = req.query.depositor_address;
    var token_address = req.query.token_address;
    var params = {
      depositor_address,
      token_address
    }
    let items = await StakingAPI.getAddressAggregation(params);
    if (items.data) {
      return res.ok(items.data);
    }
    else {
      return res.ok([]);
    }
  }
  catch (err) {
    logger.error("get address's aggregation failed:", err);
    next(err);
  }
}


module.exports = {
  getDeposit: getDeposit,
  getHistoryOfAddress: getHistoryOfAddress,
  getAddressAggregation: getAddressAggregation
}
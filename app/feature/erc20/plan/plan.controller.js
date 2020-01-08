
const logger = require("app/lib/logger");
const StakingAPI = require("app/lib/staking-api")

async function getAllPlans(req, res, next) {
  try {
    var status = req.query.status;
    var staking_platform_id = req.query.staking_platform_id;
    var include_deleted = req.query.include_deleted;
    let items = await StakingAPI.getPlans({ status, staking_platform_id, include_deleted });
    if (items.data) {
      return res.ok(items.data);
    }
    else {
      return res.ok([]);
    }
  }
  catch (err) {
    logger.error("get plans fail:", err);
    next(err);
  }
}

async function insertPlan(req, res, next) {
  throw "NOT IMPLEMENT"
}
async function updatePlan(req, res, next) {
  throw "NOT IMPLEMENT"
}
module.exports = {
  getAllPlans: getAllPlans,
  insertPlan: insertPlan,
  updatePlan: updatePlan
}
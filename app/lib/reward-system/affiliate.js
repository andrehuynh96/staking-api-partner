const config = require('app/config');
const RewardSystem = require("./index");

let affiliate = new RewardSystem({
  baseUrl: config.rewardSystem.url,
  apiKey: config.rewardSystem.apiKey,
  secretKey: config.rewardSystem.secretKey,
  typeId: config.rewardSystem.affiliateTypeId
});
module.exports = affiliate;
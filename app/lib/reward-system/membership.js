const config = require('app/config');
const RewardSystem = require("./index");

let membership = new RewardSystem({
  baseUrl: config.rewardSystem.url,
  apiKey: config.rewardSystem.apiKey,
  secretKey: config.rewardSystem.secretKey,
  typeId: config.rewardSystem.membershipTypeId
});
module.exports = membership;
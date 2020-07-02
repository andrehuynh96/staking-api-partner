const config = require("app/config");
const axios = require("axios");
const logger = require("app/lib/logger")
const redisResource = require("app/resource/redis");
const redis = require("app/lib/redis");
const cache = redis.client();

module.exports = {
  platformVote: async () => {
    try {
      let accessToken = await _getToken();
      let result = await axios.get(`${config.stakingApi.url}/platform-votes`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`
        }
      });
      return { httpCode: 200, data: result.data };
    }
    catch (err) {
      logger.error("platformVote fail:", err);
      return { httpCode: err.response.status, data: err.response.data };
    }
  },
  trackingVote: async ({ tx_id, voter_address, memo, type, amount }) => {
    try {
      let accessToken = await _getToken();
      let result = await axios.post(`${config.stakingApi.url}/voting`, {
        tx_id: tx_id,
        voter_address: voter_address,
        memo: memo,
        type: type,
        amount: amount
      }, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`
          }
        });
      return { httpCode: 200, data: result.data };
    }
    catch (err) {
      logger.error("platformVote fail:", err);
      return { httpCode: err.response.status, data: err.response.data };
    }
  },
  getPlans: async ({ status, staking_platform_id }) => {
    try {
      let accessToken = await _getToken();
      let result = await axios.get(
        `${config.stakingApi.url}/erc20/plans`, {
          params: {
            status: status,
            staking_platform_id: staking_platform_id
          },
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`
          }
        });
      return { httpCode: 200, data: result.data };
    }
    catch (err) {
      logger.error("platformVote fail:", err);
      return { httpCode: err.response.status, data: err.response.data };
    }
  },

  getERC20Deposit: async ({
    depositor_address,
    deposit_id,
    token_address,
    pool_id,
    plan_id,
    partner_id,
    offset,
    limit
  }) => {
    try {
      let accessToken = await _getToken();
      let result = await axios.get(
        `${config.stakingApi.url}/erc20/deposits`, {
          params: {
            depositor_address: depositor_address,
            deposit_id: deposit_id,
            token_address: token_address,
            pool_id: pool_id,
            plan_id: plan_id,
            partner_id: partner_id,
            offset: offset,
            limit: limit,
          },
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`
          }
        });
      return { httpCode: 200, data: result.data };

    }
    catch (err) {
      logger.error("getERC20Deposit fail:", err);
      return { httpCode: err.response.status, data: err.response.data };
    }
  },

  getERC20History: async ({
    depositor_address,
    token_address,
    offset,
    limit
  }) => {
    try {
      let accessToken = await _getToken();
      let result = await axios.get(
        `${config.stakingApi.url}/erc20/history`, {
          params: {
            depositor_address: depositor_address,
            token_address: token_address,
            offset: offset,
            limit: limit,
          },
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`
          }
        });
      return { httpCode: 200, data: result.data };

    }
    catch (err) {
      logger.error("getERC20History fail:", err);
      return { httpCode: err.response.status, data: err.response.data };
    }
  },

  getAddressAggregation: async ({
    depositor_address,
    token_address
  }) => {
    try {
      let accessToken = await _getToken();
      let result = await axios.get(
        `${config.stakingApi.url}/erc20/aggregation`, {
          params: {
            depositor_address: depositor_address,
            token_address: token_address,
          },
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`
          }
        });
      return { httpCode: 200, data: result.data };
    }
    catch (err) {
      logger.error("getAddressAggregation fail:", err);
      return { httpCode: err.response.status, data: err.response.data };
    }
  }

}

async function _getToken() {
  let token = await cache.getAsync(redisResource.stakingApi.token);
  if (token) {
    return token;
  }
  let result = await axios.post(
    `${config.stakingApi.url}/accounts/authentication`,
    {
      api_key: config.stakingApi.key,
      secret_key: config.stakingApi.secret,
      grant_type: "client_credentials"
    }
  );

  await cache.setAsync(redisResource.stakingApi.token, result.data.data.access_token, "EX", parseInt(result.data.data.expires_in) - 10);
  return result.data.data.access_token;
}
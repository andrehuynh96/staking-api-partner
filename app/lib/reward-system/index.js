const config = require("app/config");
const axios = require("axios");
const logger = require("app/lib/logger")
const redisResource = require("app/resource/redis");
const redis = require("app/lib/redis");
const cache = redis.client();
const queryString = require('query-string')

class RewardSystem {
  constructor({ baseUrl, apiKey, secretKey, typeId }) {
    this.typeId = typeId;
    this.baseUrl = baseUrl;
    this.secretKey = secretKey;
    this.apiKey = apiKey;
  }

  async register({ email, referrerCode }) {
    try {
      let headers = await this._getHeader(true);
      let result = await axios.post(`${this.baseUrl}/clients`,
        {
          ext_client_id: email,
          affiliate_code: referrerCode || ""
        },
        {
          headers: headers
        });
      return { httpCode: 200, data: result.data };

    }
    catch (err) {
      console.log('err', err)
      logger.error("create client fail:", err);
      return { httpCode: err.response.status, data: err.response.data };
    }
  }

  async updateReferrer({ email, referrerCode }) {
    try {
      let headers = await this._getHeader(true);
      let result = await axios.put(`${this.baseUrl}/clients/affiliate-codes`,
        {
          ext_client_id: email,
          affiliate_code: referrerCode
        },
        {
          headers: headers
        });
      return { httpCode: 200, data: result.data };

    }
    catch (err) {
      logger.error("create client fail:", err);
      return { httpCode: err.response.status, data: err.response.data };
    }
  }

  async getReferrals({ email, offset = 0, limit = 10 }) {
    try {
      const data = {
        ext_client_id: email,
        limit: limit,
        offset: offset
      };
      const queryData = queryString.stringify(data);
      let headers = await this._getHeader();
      let result = await axios.get(`${this.baseUrl}/clients/invitees?${queryData}`,
        {
          headers: headers
        });
      return { httpCode: 200, data: result.data };

    }
    catch (err) {
      logger.error("create client fail:", err);
      return { httpCode: err.response.status, data: err.response.data };
    }
  }

  async getRewards({ email }) {
    try {
      const data = {
        ext_client_id: email
      };
      const queryData = queryString.stringify(data);
      let headers = await this._getHeader();
      let result = await axios.get(`${this.baseUrl}/available-rewards?${queryData}`,
        {
          headers: headers
        });
      return { httpCode: 200, data: result.data };

    }
    catch (err) {
      logger.error("get available rewards fail:", err);
      return { httpCode: err.response.status, data: err.response.data };
    }
  }

  async getStatistics({ email }) {
    try {
      const data = {
        ext_client_id: email
      };
      const queryData = queryString.stringify(data);
      let headers = await this._getHeader();
      let result = await axios.get(`${this.baseUrl}/reward-statistics?${queryData}`,
        {
          headers: headers
        });
      return { httpCode: 200, data: result.data };

    }
    catch (err) {
      logger.error("get available rewards fail:", err);
      return { httpCode: err.response.status, data: err.response.data };
    }
  }

  async getRewardHistories({ email, offset = 0, limit = 10 }) {
    try {
      const data = {
        ext_client_id: email,
        limit: limit,
        offset: offset
      };
      const queryData = queryString.stringify(data);
      let headers = await this._getHeader();
      let result = await axios.get(`${this.baseUrl}/rewards?${queryData}`,
        {
          headers: headers
        });
      return { httpCode: 200, data: result.data };

    }
    catch (err) {
      logger.error("get reward history fail:", err);
      return { httpCode: err.response.status, data: err.response.data };
    }
  }

  async isCheckReferrerCode({ referrerCode }) {
    try {
      let headers = await this._getHeader();
      let result = await axios.get(`${this.baseUrl}/affiliate-codes/${referrerCode}/can-referer`,
        {
          headers: headers
        });
      return { httpCode: 200, data: result.data };

    }
    catch (err) {
      logger.error("check referrer code for can-referer fail:", err);
      return { httpCode: err.response.status, data: err.response.data };
    }
  }

  async clickReferrerUrl(code) {
    try {
      let headers = await this._getHeader(true);
      let result = await axios.post(`${this.baseUrl}/affiliate-codes/${code}/click`,
        {},
        {
          headers: headers
        });
      return { httpCode: 200, data: result.data };

    }
    catch (err) {
      logger.error("create client fail:", err);
      return { httpCode: err.response.status, data: err.response.data };
    }
  }

  async claimReward({ email, currency_symbol, amount, latest_id }) {
    try {
      let headers = await this._getHeader(true);
      let result = await axios.post(`${this.baseUrl}/claim-rewards`,
        {
          ext_client_id: email,
          currency_symbol: currency_symbol,
          amount: amount,
          latest_id: latest_id
        },
        {
          headers: headers
        });
      return { httpCode: 200, data: result.data.data };

    }
    catch (err) {
      logger.error("create client fail:", err);
      return { httpCode: err.response.status, data: err.response.data };
    }
  }

  async deactivate({ email }) {
    try {
      const data = {
        ext_client_id: email
      };
      const queryData = queryString.stringify(data);
      let headers = await this._getHeader(true);
      let result = await axios.put(`${this.baseUrl}/clients/deactivate?${queryData}`,
        {},
        {
          headers: headers
        });
      return { httpCode: 200, data: result.data };
    }
    catch (err) {
      logger.error("create client fail:", err);
      return { httpCode: err.response.status, data: err.response.data };
    }
  }

  async activate({ email }) {
    try {
      const data = {
        ext_client_id: email
      };
      const queryData = queryString.stringify(data);
      let headers = await this._getHeader(true);
      let result = await axios.put(`${this.baseUrl}/clients/activate?${queryData}`,
        {},
        {
          headers: headers
        });
      return { httpCode: 200, data: result.data };
    }
    catch (err) {
      logger.error("create client fail:", err);
      return { httpCode: err.response.status, data: err.response.data };
    }
  }

  async getAffiliateStatistics({ email }) {
    try {
      const data = {
        ext_client_id: email
      };
      const queryData = queryString.stringify(data);
      let headers = await this._getHeader();
      let result = await axios.get(`${this.baseUrl}/affiliate-reward-statistics?${queryData}`,
        {
          headers: headers
        });
      return { httpCode: 200, data: result.data };

    }
    catch (err) {
      logger.error("get available rewards fail:", err);
      return { httpCode: err.response.status, data: err.response.data };
    }
  }

  async _getHeader(checksum = false) {
    let accessToken = await this._getToken();
    let header = {
      "Content-Type": "application/json",
      "x-affiliate-type-id": this.typeId,
      Authorization: `Bearer ${accessToken}`,
    }

    if (checksum) {
      header = {
        ...header,
        ...{
          "x-use-checksum": true,
          "x-secret": this.secretKey,
        }
      }
    }

    return header;
  }

  async _getToken() {
    let key = `${redisResource.rewardSystem.token}:${this.typeId}`;
    let token = await cache.getAsync(key);
    if (token) {
      return token;
    }
    let result = await axios.post(
      `${this.baseUrl}/auth/token`,
      {
        api_key: this.apiKey,
        secret_key: this.secretKey,
        grant_type: "client_credentials"
      }
    );

    await cache.setAsync(key, result.data.data.access_token, "EX", 3600);
    return result.data.data.access_token;
  }
}

module.exports = RewardSystem;
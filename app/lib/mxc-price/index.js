const logger = require('app/lib/logger');
const config = require("app/config");
const Axios = require('axios');
const redis = require("app/lib/redis");
const cache = redis.client();

module.exports = {
  getPrice: async (platform) => {
    try {
      const key = 'MXC_' + platform.toUpperCase() + '_USDT';
      let price = await cache.getAsync(key);
      if (price === null) {
        let result = await Axios.get(`${config.mxcAPI}/v2/market/ticker?symbol=${platform.toUpperCase()}_USDT`);
        result = result.data.data[0];
        await cache.setAsync(key, JSON.stringify({
          price: parseFloat(result.last),
          usd_24h_change: parseFloat(result.last) - parseFloat(result.open)
        }), "EX", 30);
        return {
          price: parseFloat(result.last),
          usd_24h_change: parseFloat(result.last) - parseFloat(result.open)
        };

      }
      return JSON.parse(price);
    }
    catch (err) {
      logger.info('mxc get price no found data with currency' + platform);
      throw err;
    }
  },
} 
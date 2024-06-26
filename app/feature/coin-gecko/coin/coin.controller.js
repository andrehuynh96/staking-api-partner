const logger = require('app/lib/logger');
const coinGeckoClient = require('app/lib/coin-gecko-client');
const TimeUnit = require('app/model/wallet/value-object/time-unit');
const Platform = require('app/model/wallet/value-object/platform');
const { getDateRangeUnitTimeStamp } = require('app/lib/utils');
const redis = require("app/lib/redis");
const cache = redis.client();
const secret = "MS_CACHE";
const config = require('app/config');
const crypto = require('crypto');
const mxcPrice = require('app/lib/mxc-price');

module.exports = {
  getPrice: async (req, res, next) => {
    try {
      const platform = req.query.platform;
      //:TODO hardcode CPAY call to mxc due to coingecko not yet support
      if (platform.toUpperCase() === 'CPAY') {
        const price = await mxcPrice.getPrice(platform);
        return res.ok(price);
      }

      if (!Platform[platform]) {
        return res.badRequest(res.__("MISSING_PARAMETER"), "MISSING_PARAMETER");
      }

      const price = await coinGeckoClient.getPrice({ platform_name: platform, currency: 'usd' });
      return res.ok(price);
    }
    catch (error) {
      logger.error('get price of platform fail', error);
      next(error);
    }
  },

  getHistories: async (req, res, next) => {
    try {
      const { date_type, platform } = req.query;
      const date_num = req.query.date_num || 1;
      if (!date_type || !TimeUnit[date_type.toUpperCase()] || !Platform[platform]) {
        if (date_type.toUpperCase() != "ALL") {
          return res.badRequest(res.__("MISSING_PARAMETER"), "MISSING_PARAMETER");
        }
      }

      const { from, to } = getDateRangeUnitTimeStamp(date_type.toUpperCase(), date_num);
      const histories = await coinGeckoClient.getHistories({
        platform_name: platform,
        from: from,
        to: to
      })

      return res.ok(histories);
    }
    catch (error) {
      logger.error('get price history of platform fail', error);
      next(error);
    }
  },

  getMultiPrice: async (req, res, next) => {
    try {
      const platforms = req.query.platforms;
      let platformList = platforms.split(',');
      let cpayPrice = null;;
      //:TODO hardcode CPAY call to mxc due to coingecko not yet support
      if (platformList.includes('CPAY')) {
        cpayPrice = await mxcPrice.getPrice('CPAY');
        platformList = platformList.filter(x => x != "CPAY");
      }

      let supportPlatforms = Object.values(Platform).reduce((result, value) => {
        result[value.symbol] = value;
        return result;
      }, {});

      if (!platforms || platformList.length == 0) {
        return res.badRequest(res.__("MISSING_PARAMETER"), "MISSING_PARAMETER");
      }

      const notFoundList = [];
      platformList.forEach(item => {
        if (!supportPlatforms[item]) {
          notFoundList.push(item);
        }
      });

      if (notFoundList.length > 0) {
        return res.badRequest(res.__("MISSING_PARAMETER"), "MISSING_PARAMETER", { field: notFoundList });
      }

      const valid = platformList.map(item => supportPlatforms[item]);
      const result = await _getPrice(valid);

      if (cpayPrice) {
        result.cpay = {
          usd: cpayPrice.price,
          usd_24h_change: cpayPrice.usd_24h_change
        };
      }
      return res.ok(result);
    }
    catch (error) {
      logger.error('get price of multi platform fail', error);
      next(error);
    }
  },

  getMarkets: async (req, res, next) => {
    try {
      const platform = req.query.platform;
      if (!Platform[platform]) {
        return res.badRequest(res.__("MISSING_PARAMETER"), "MISSING_PARAMETER");
      }

      const markets = await coinGeckoClient.getMarkets({ platform_name: platform });

      return res.ok(markets);
    }
    catch (error) {
      logger.error('get market of platform fail', error);
      next(error);
    }
  }
}

async function _getPrice(platforms) {
  let response = {};
  let req = [];
  for (let i of platforms) {
    const result = await _getCachePrice(i.symbol);
    if (i.coingeckoId) {
      if (result) {
        response[i.coingeckoId] = result;
      }
      else {
        req.push(i);
      }
    }
  }
  if (req.length > 0) {

    const prices = await coinGeckoClient.getMultiPrice(req.map(x => x.coingeckoId));
    if (prices) {
      response = { ...response, ...prices };
      for (let i of req) {
        let p = prices[i.coingeckoId];
        if (p) {
          const key = `/coin-gecko/prices?platform=${i.symbol}`
          const keyHash = crypto.createHmac('sha256', secret)
            .update(key)
            .digest('hex');
          await cache.setAsync(keyHash, JSON.stringify({
            data: {
              price: p.usd,
              usd_24h_change: p.usd_24h_change
            }
          }), "EX", config.cacheDurationTime * 60);
        }
      }
    }
  }

  return response;
}

async function _getCachePrice(symbol) {
  const key = `/coin-gecko/prices?platform=${symbol}`;
  const keyHash = crypto.createHmac('sha256', secret)
    .update(key)
    .digest('hex');

  let cacheContent = await cache.getAsync(keyHash);
  if (cacheContent) {
    let data = JSON.parse(cacheContent);
    if (data && data.data) {
      return {
        usd: data.data.price,
        usd_24h_change: data.data.usd_24h_change
      }
    }
  }
  return null;
}
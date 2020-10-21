const logger = require('app/lib/logger');
const CoinGeckoId = require('app/model/wallet/value-object/coin-gecko-id');
const TimeUnit = require('app/model/wallet/value-object/time-unit');
const coinGeckoClient = require('app/lib/coin-gecko-client');
const { getDateRangeUnitTimeStamp } = require('app/lib/utils');

module.exports = {
    getPrice: async (req, res, next) => {
        try {
            const { platform } = req.query;
            const coinId = CoinGeckoId[platform];
            if (!platform || !coinId) {
                return res.badRequest(res.__('COIN_GECKO_ID_NOT_FOUND'), ('COIN_GECKO_ID_NOT_FOUND'), { field: ['platform'] });
            }
            const price = await coinGeckoClient.getPrice(coinId);

            return res.ok(price);
        } catch (error) {
            logger.error('Get coin price fail', error);
            next(error);
        }
    },
    getHistories: async (req, res, next) => {
        try {
            const { date_type, platform } = req.query;
            const date_num = req.query.date_num || 1;
            if (!date_type || !TimeUnit[date_type.toUpperCase()] || !CoinGeckoId[platform]) {
                if (date_type.toUpperCase() != 'ALL') {
                    return res.badRequest(res.__('MISSING_PARAMETER'), 'MISSING_PARAMETER');
                }
            }

            const { from, to } = getDateRangeUnitTimeStamp(date_type.toUpperCase(), date_num);
            const histories = await coinGeckoClient.getHistories(CoinGeckoId[platform], from, to);

            return res.ok(histories);
        } catch (error) {
            logger.error('Get coin histories fail', error);
            next(error);
        }
    },
    getMarkets: async (req, res, next) => {
        try {
            const platform = req.query.platform;
            const coinId = CoinGeckoId[platform];
            if (!platform || !coinId) {
                return res.badRequest(res.__('COIN_GECKO_ID_NOT_FOUND'), ('COIN_GECKO_ID_NOT_FOUND'), { field: ['platform'] });
            }

            const markets = await coinGeckoClient.getMarkets(coinId);

            return res.ok(markets);
        } catch (error) {
            logger.error('Get coin markets fail', error);
            next(error);
        }
    },
};

const logger = require('app/lib/logger');
const CoinGeckoId = require('app/model/wallet/value-object/coin-gecko-id');
const TimeUnit = require('app/model/wallet/value-object/time-unit');
const coinGeckoClient = require('app/lib/coin-gecko-client');
const { getDateRangeUnitTimeStamp } = require('app/lib/utils');

module.exports = {
    getTokenPrice: async (req, res, next) => {
        try {
            const { platform, contract_addresses } = req.query;
            const coinGeckoId = CoinGeckoId[platform];
            if (!platform || !contract_addresses || !coinGeckoId) {
                return res.badRequest(res.__('MISSING_PARAMETER'), 'MISSING_PARAMETER');
            }

            const tokenPrice = await coinGeckoClient.getTokenPrice(coinGeckoId,contract_addresses);

            return res.ok(tokenPrice[contract_addresses]);
        }
        catch (error) {
            logger.error('get token price of platform fail', error);
            next();
        }
    },

    getTokenHistories: async (req, res, next) => {
        try {
            const { date_type, platform, contract_addresses } = req.query;
            const date_num = req.query.date_num || 1;
            const coinGeckoId = CoinGeckoId[platform];
            if (!date_type || !TimeUnit[date_type.toUpperCase()] || !platform || !contract_addresses || !coinGeckoId) {
                return res.badRequest(res.__('MISSING_PARAMETER'), 'MISSING_PARAMETER');
            }

            const { from, to } = getDateRangeUnitTimeStamp(date_type.toUpperCase(), date_num);
            const histories = await coinGeckoClient.getTokenHistories(coinGeckoId,contract_addresses,from,to);

            return res.ok(histories);
        }
        catch (error) {
            logger.error('get price history of platform fail', error);
            next();
        }
    },
};

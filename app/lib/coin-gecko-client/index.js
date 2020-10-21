const logger = require('app/lib/logger');
const CoinGecko = require('coingecko-api');
const coinGeckoClient = new CoinGecko();
module.exports = {
  getPrice: async (coingeckoId) => {
    try {
        const coinPrices = await coinGeckoClient.simple.price({
          ids: coingeckoId,
          vs_currencies: 'usd',
          include_24hr_change: true
        });

        return coinPrices.data[coingeckoId];
    }
    catch (error) {
      logger.info('coinGeckoClient.simple.price no found data with currency' + coinId);
      throw error;
    }
  },
  getHistories: async (coinId, from, to) => {
    try {
      console.log(from,to);
      const coinHistories = await coinGeckoClient.coins.fetchMarketChartRange(coinId, { from: from, to: to });
      return coinHistories.data;
    }
    catch (error) {
      logger.info('coinGeckoClient.coins.fetchMarketChartRange no found data with currency' + coinId);
      throw error;
    }
  },
  getTokenPrice: async(coingecko_id, contract_addresses) => {
    try {
      const tokenPrices = await coinGeckoClient.simple.fetchTokenPrice({
        ids: coingecko_id,
        contract_addresses : contract_addresses,
        vs_currencies: 'usd',
        include_24hr_change: true
      });
      return tokenPrices.data;
    }
    catch (error) {
      logger.info('coinGeckoClient.simple.token_price no found data with currency and contract address' + contract_addresses);
      throw error;
    }
  },
  getTokenHistories: async (coingecko_id, contract_addresses , from, to) => {
    try {
      console.log(coingecko_id, contract_addresses , from, to);
      const tokenHistories = await coinGeckoClient.coins.fetchCoinContractMarketChartRange(contract_addresses,coingecko_id, { from: from, to: to });
      return tokenHistories.data;
    }
    catch (error) {
      logger.info('coinGeckoClient.coins.fetchCoinContractMarketChartRange no found data with contract address' + contract_addresses);
      throw error;
    }
  },
  getMarkets: async (coinId) => {
    try {
    const result = await coinGeckoClient.coins.markets({
      ids: coinId,
      vs_currency: 'usd'
    });
      return result.data;
    }
    catch (err) {
      logger.info('coinGeckoClient.coins.markets no found data with' + coinId);
      throw err;
    }
  }
}

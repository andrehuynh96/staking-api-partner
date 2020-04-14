const logger = require('app/lib/logger');
const config = require('app/config');
const Currency = require('app/model/wallet').currencies;
const CurrencyStatus = require('app/model/wallet/value-object/currency-status');
const mapper = require('./currency.response-schema');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const StakingAPI = require("app/lib/staking-api")
const CurrencyType = require("app/model/wallet/value-object/currency-type");

module.exports = {
  getAll: async (req, res, next) => {
    try {
      logger.info('currencies::list');
      let { query: { search } } = req
      let limit = parseInt(req.query.limit) || parseInt(config.appLimit);
      let offset = req.query.offset ? parseInt(req.query.offset) : 0;
      let where = {};
      if (search) {
        where = {
          [Op.or]: [{
            symbol: { [Op.iLike]: `%${search}%` }
          },
          {
            name: { [Op.iLike]: `%${search}%` }
          },
          {
            platform: { [Op.iLike]: `%${search}%` }
          }]
        }
      }
      if (req.query.default != undefined) {
        where.default_flg = req.query.default;
      }
      where.status = CurrencyStatus.ENABLED;
      const { count: total, rows: items } = await Currency.findAndCountAll({ limit, offset, where: where, order: [['order_index', 'ASC']] });

      let votings = await StakingAPI.platformVote();
      let response = mapper(items);

      if (votings.httpCode == 200) {
        for (let e of response) {
          let stakes = [];
          if (e.type == CurrencyType.NATIVE) {
            stakes = votings.data.data.filter(x => x.status == 1 && e.platform == x.platform);
          }
          else {
            stakes = votings.data.data.filter(x => x.status == 1 && e.platform == x.platform && e.sc_token_address == x.sc_token_address);
          }

          if (stakes.length > 0) {
            e.staking_flg = true;
            e.staking_info = stakes[0];
          }
          else {
            e.staking_flg = false;
          }
        }
      }
      return res.ok({
        items: response,
        offset: offset,
        limit: limit,
        total: total
      });
    }
    catch (err) {
      logger.error('get list currency fail:', err);
      next(err);
    }
  }
}
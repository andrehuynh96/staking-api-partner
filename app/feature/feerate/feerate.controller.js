const logger = require('app/lib/logger');
const Feerates = require('app/model/wallet').feerates;
const mapper = require('./feerate.response-schema');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

module.exports = {
  get: async (req, res, next) => {
    try {
      let { symbol } = req.params;
      let coin = await Feerates.findOne({
        where: {
          symbol: symbol.toUpperCase()
        },
        raw: true
      });
      return res.ok(mapper(coin));
    }
    catch (err) {
      logger.error('get list currency fail:', err);
      next(err);
    }
  },

  getAll: async (req, res, next) => {
    try {
      let { query: { search } } = req;
      let limit = parseInt(req.query.limit) || 10;
      let offset = req.query.offset ? parseInt(req.query.offset) : 0;
      let where = {};
      if (search) {
        where = {
          [Op.or]: [{
            symbol: { [Op.iLike]: `%${search}%` }
          },
          {
            name: { [Op.iLike]: `%${search}%` }
          }]
        };
      }
      const { count: total, rows: items } = await Feerates.findAndCountAll({ limit, offset, where: where, order: [['symbol', 'ASC']] });
      return res.ok({
        items: mapper(items),
        offset: offset,
        limit: limit,
        total: total
      });
    }
    catch (err) {
      logger.error('get list feerate fail:', err);
      next(err);
    }
  }
};

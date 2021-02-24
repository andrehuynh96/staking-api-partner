const logger = require('app/lib/logger');
const ExchangeTransaction = require('app/model/wallet').exchange_transactions;
const Mapper = require("app/feature/response-schema/exchange/transaction.response-schema");
const uuidvalidate = require('uuid-validate');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

module.exports = async (req, res, next) => {
  try {
    logger.info('transaction::detail');
    let where = {};
    if (uuidvalidate(req.params.id)) {
      where = {
        id: req.params.id
      };
    }
    else {
      where = {
        transaction_id: req.params.id
      };
    }

    const transaction = await ExchangeTransaction.findOne({ where: where });
    if (!transaction) {
      return res.badRequest(res.__("TRANSACTION_NOT_FOUND"), "TRANSACTION_NOT_FOUND", {
        fields: ['id'],
      });
    }
    return res.ok(Mapper(transaction));
  }
  catch (err) {
    logger.error("get transaction detail fail: ", err);
    next(err);
  }
}

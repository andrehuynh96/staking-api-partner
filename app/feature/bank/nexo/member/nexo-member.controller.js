const logger = require('app/lib/logger');
const BankFactory = require('app/service/banking/factory');
const BankProvider = require('app/service/banking/provider');
const NexoMember = require('app/model/wallet').nexo_members;
const balanceMapper = require('./nexo-balance.response-schema');
const mapper = require('./nexo-member.response-schema');
module.exports = {
  recoveryRequest: async (req, res, next) => {
    try {
      let member = NexoMember.findOne({
        where: {
          email: req.body.email
        }
      });
      if (!member)
        return res.badRequest(res.__("NEXO_MEMBER_NOT_EXISTED"), "NEXO_MEMBER_NOT_EXISTED");
      const Service = BankFactory.create(BankProvider.Nexo, {});
      let result = await Service.requestRecoveryCode({
        email: req.body.email
      });
      if (result.error)
        return res.badRequest(result.error.message, "NEXO_ERROR");
      return res.ok(true);
    } catch (err) {
      logger[err.canLogAxiosError ? 'error' : 'info']('request recovery nexo accouont fail:', err);
      next(err);
    }
  },
  verifyRecovery: async (req, res, next) => {
    try {
      let { email, code } = req.body;
      let member = NexoMember.findOne({
        where: {
          email: email
        }
      });
      if (!member)
        return res.badRequest(res.__("NEXO_MEMBER_NOT_EXISTED"), "NEXO_MEMBER_NOT_EXISTED");
      const Service = BankFactory.create(BankProvider.Nexo, {});
      let result = await Service.verifyRecoveryCode({
        email: email,
        code: code
      });
      if (result.error)
        return res.badRequest(result.error.message, "NEXO_ERROR");
      let update_data = {
        nexo_id: result.id,
        user_secret: result.secret,
      }
      if (req.user && req.user.id)
        update_data.member_id = req.user.id
      await NexoMember.update(update_data,
        {
          where: {
            email: email
          }
        });
      return res.ok(true);
    } catch (err) {
      logger[err.canLogAxiosError ? 'error' : 'info']('verify recovery nexo account code fail:', err);
      next(err);
    }
  },
  getAccount: async (req, res, next) => {
    try {
      let { params: { device_code }, user } = req;
      let where = {};
      if (device_code) {
        where.device_code = device_code
      }
      if (user && user.id) {
        where.member_id = user.id
      }
      let account = await NexoMember.findOne({
        where: where
      });
      if (!account)
        return res.badRequest(res.__("NEXO_MEMBER_NOT_EXISTED"), "NEXO_MEMBER_NOT_EXISTED");
      return res.ok(mapper(account));
    } catch (err) {
      logger[err.canLogAxiosError ? 'error' : 'info']('get nexo account fail:', err);
      next(err);
    }
  },
  getBalance: async (req, res, next) => {
    try {
      let { params: { device_code }, user } = req;
      let where = {};
      if (device_code) {
        where.device_code = device_code
      }
      if (user && user.id) {
        where.member_id = user.id
      }
      let account = await NexoMember.findOne({
        where: where
      });
      if (!account)
        return res.badRequest(res.__("NEXO_MEMBER_NOT_EXISTED"), "NEXO_MEMBER_NOT_EXISTED");
      const Service = BankFactory.create(BankProvider.Nexo, {});
      const result = await Service.getBalance({
        nexo_id: account.nexo_id,
        secret: account.user_secret
      });
      if (result.error)
        return res.badRequest(result.error.message, "NEXO_ERROR");
      return res.ok(balanceMapper(result))
    } catch (err) {
      logger[err.canLogAxiosError ? 'error' : 'info']('get balance by nexo account fail:', err);
      next(err);
    }
  }
}
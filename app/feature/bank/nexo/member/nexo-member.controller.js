const logger = require('app/lib/logger');
const BankFactory = require('app/service/banking/factory');
const BankProvider = require('app/service/banking/provider');
const NexoMember = require('app/model/wallet').nexo_members;
const mapper = require('./nexo-member.response-schema');

module.exports = {
  create: async (req, res, next) => {
    try {
      let member = await NexoMember.findOne({
        where: {
          email: req.body.email
        }
      });
      if (member)
        return res.badRequest(res.__("EMAIL_EXISTED"), "EMAIL_EXISTED");
      const Service = BankFactory.create(BankProvider.Nexo, {});
      let account = await Service.createAccount(req.body);
      if (account.error)
        return res.badRequest(account.error.message, "NEXO_CREATE_ACCOUNT_ERROR");
      let nexoMember = await NexoMember.create({
        ...req.body,
        member_id: req.user ? req.user.id : req.user,
        nexo_id: account.id,
        user_secret: account.secret
      });
      return res.ok(mapper(nexoMember));
    } catch (err) {
      logger[err.canLogAxiosError ? 'error' : 'info']('create nexo account fail:', err);
      if (err.response.status == 400) {
        return res.badRequest(err.response.data.error.detail, "NEXO_CREATE_ACCOUNT_ERROR");
      }
      next(err);
    }
  },
  verify: async (req, res, next) => {
    try {
      let member = await NexoMember.findOne({
        where: {
          email: req.body.email
        }
      });
      if (!member)
        return res.badRequest(res.__("NEXO_MEMBER_NOT_EXISTED"), "NEXO_MEMBER_NOT_EXISTED");
      const Service = BankFactory.create(BankProvider.Nexo, {});
      let result = await Service.verifyEmail({
        nexo_id: member.nexo_id,
        secret: member.user_secret,
        code: req.body.code
      });
      if (result.error)
        return res.badRequest(result.error.message, "NEXO_VERIFY_ACCOUNT_ERROR");
      await NexoMember.update({
        status: Status.ACTIVATED
      }, {
        where: {
          email: req.body.email
        }
      });
      return res.ok(true);
    } catch (err) {
      logger[err.canLogAxiosError ? 'error' : 'info']('verify nexo account fail:', err);
      if (err.response.status == 400) {
        return res.badRequest(err.response.data.error.detail, "NEXO_VERIFY_ACCOUNT_ERROR");
      }
      next(err);
    }
  },
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
      logger.error('request recovery nexo account fail:', err);
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
      logger.error('verify recovery nexo account code fail:', err);
      next(err);
    }
  }
}
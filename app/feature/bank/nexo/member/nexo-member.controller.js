const logger = require('app/lib/logger');
const BankFactory = require('app/service/banking/factory');
const BankProvider = require('app/service/banking/provider');
const NexoMember = require('app/model/wallet').nexo_members;

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
const logger = require('app/lib/logger');
const config = require('app/config');
const ClaimPoint = require('app/model/wallet').claim_points;
const claimPointMapper = require('./claim-point.response-schema');
const MembershipType = require('app/model/wallet').membership_types;
const Setting = require('app/model/wallet').settings;
const Member = require('app/model/wallet').members;
module.exports = {
  getAll: async (req, res, next) => {
    try {
      logger.info('claim-point::history');
      const { query: { offset, limit}, user } = req;
      const where = { member_id: user.id };
      const off = parseInt(offset) || 0;
      const lim = parseInt(limit) || parseInt(config.appLimit);

      const { count: total, rows: claims } = await ClaimPoint.findAndCountAll({ offset: off, limit: lim, where: where, order: [['created_at','DESC']] });
      return res.ok({
        items: claimPointMapper(claims),
        offset: off,
        limit: lim,
        total: total
      });
    }
    catch (err) {
      logger.error("get history claim point fail: ", err);
      next(err);
    }
  },
  setting: async (req, res, next) => {
    try {
      logger.info('claim-point::setting');
      let member = await Member.findOne({
        where: {
          id: req.user.id
        }
      })
      let membershipType = await MembershipType.findOne({
        where: {
          id: member.membership_type_id,
          deleted_flg: false
        }
      })
      let setting = await Setting.findOne({
        where: {
          key: config.setting.MS_POINT_DELAY_TIME_IN_SECONDS
        }
      })
      return res.ok({
        amount: membershipType ? membershipType.claim_points : undefined,
        time: setting ? parseInt(setting.value) : undefined
      })
    } catch (err) {
      logger.error("get setting claim point fail: ", err);
      next(err);
    }
  },
  create: async (req, res, next) => {
    try {
      let member = await Member.findOne({
        where: {
          id: req.user.id
        }
      })
      let membershipType = await MembershipType.findOne({
        where: {
          id: member.membership_type_id,
          deleted_flg: false
        }
      })
      if (membershipType) {
        await ClaimPoint.create({
          member_id: req.user.id,
          amount: membershipType.claim_points,
          currency_symbol: req.body.currency_symbol || "MS_POINT"
        });
        return res.ok(true);
      } else {
        return res.ok(false);
      }
    } catch (err) {
      logger.error("create claim point fail: ", err);
      next(err);
    }
  }
}

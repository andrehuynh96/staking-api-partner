const logger = require('app/lib/logger');
const Member = require('app/model/wallet').members;
const MemberStatus = require('app/model/wallet/value-object/member-status');
const memberMapper = require('../member.response-schema');
const config = require('app/config');
const MembershipType = require("app/model/wallet").membership_types;

module.exports = async (req, res, next) => {
  try {
    let user = await Member.findOne({
      include: [{
        model: MembershipType,
        as: 'MembershipType',
        attributes: ['id', 'name', 'type']
      }],
      where: {
        id: req.user.id,
        deleted_flg: false
      }
    });
    if (!user) {
      return res.badRequest(res.__('USER_NOT_FOUND'), 'USER_NOT_FOUND');
    }

    if (user.member_sts == MemberStatus.UNACTIVATED) {
      return res.forbidden(res.__('UNCONFIRMED_ACCOUNT'), 'UNCONFIRMED_ACCOUNT');
    }

    if (user.member_sts == MemberStatus.LOCKED) {
      return res.forbidden(res.__('ACCOUNT_LOCKED'), 'ACCOUNT_LOCKED');
    }

    user.referral_link = `${config.membership.referralUrl}${user.referral_code}`
    user.membership_type_name = user.MembershipType.name
    return res.ok(memberMapper(user));
  }
  catch (err) {
    logger.error('get profile fail: ', err);
    next(err);
  }
};

const logger = require("app/lib/logger");
const Member = require("app/model/wallet").members;
const MembershipType = require("app/model/wallet").membership_types;
const MemberStatus = require('app/model/wallet/value-object/member-status');
const MembershipTypeKey = require('app/model/wallet/value-object/membership-type');
const KycLevel = require('app/model/wallet/value-object/kyc-level');
const Affiliate = require('app/lib/reward-system/affiliate');
const Membership = require('app/lib/reward-system/membership');
const PointService = require('app/lib/point');
const database = require('app/lib/database').db().wallet;

module.exports = async (req, res, next) => {
  let transaction;
  try {
    let member = await Member.findOne({
      where: {
        id: req.user.id,
        deleted_flg: false
      }
    });

    if (!member) {
      return res.badRequest(res.__("NOT_FOUND_USER"), "NOT_FOUND_USER");
    }

    if (member.member_sts == MemberStatus.LOCKED) {
      return res.forbidden(res.__("ACCOUNT_LOCKED"), "ACCOUNT_LOCKED");
    }

    if (member.member_sts == MemberStatus.UNACTIVATED) {
      return res.forbidden(res.__("UNCONFIRMED_ACCOUNT"), "UNCONFIRMED_ACCOUNT");
    }

    if (member.referrer_code) {
      return res.badRequest(res.__("REFERRER_CODE_SET_ALREADY"), "REFERRER_CODE_SET_ALREADY");
    }


    const referrerCode = await Membership.isCheckReferrerCode({ referrerCode: req.body.referrer_code });
    if (referrerCode.httpCode !== 200 ||
      !referrerCode.data.data.isValid) {
      return res.badRequest(res.__("NOT_FOUND_AFFILIATE_CODE"), "NOT_FOUND_AFFILIATE_CODE");
    }

    let result = await Affiliate.updateReferrer({ email: member.email, referrerCode: req.body.referrer_code });

    if (result.httpCode != 200) {
      return res.status(result.httpCode).send(result.data);
    }
    if (!result.data.data.isSuccess) {
      return res.serverInternalError();
    }

    let data = {
      referrer_code: req.body.referrer_code
    }
    if (member.kyc_level == KycLevel.LEVEL_1) {
      let membershipType = await MembershipType.findOne({
        where: {
          is_enabled: true,
          deleted_flg: false,
          key: MembershipTypeKey.GOLD
        }
      })
      if (membershipType) {
        data.membership_type_id = membershipType.id
      }
    }

    transaction = await database.transaction();
    let [_, response] = await Member.update({
      referrer_code: req.body.referrer_code
    }, {
      where: {
        id: member.id
      },
      returning: true,
      plain: true,
      transaction: transaction
    });

    if (data.membership_type_id) {
      result = await Membership.updateMembershipType(
        {
          email: response.email,
          membership_type_id: data.membership_type_id,
          referrer_code: response.referrer_code,
        });
      if (result.httpCode !== 200) {
        await transaction.rollback();
        return res.status(result.httpCode).send(result.data);
      }
    }
    await transaction.commit();
    PointService.upgradeMembership({
      member_id: response.id,
      membership_type_id: response.membership_type_id
    });
    return res.ok(true);

  }
  catch (err) {
    logger.error('update-referrer fail:', err);
    if (transaction) {
      await transaction.rollback()
    };
    next(err);
  }
} 
const logger = require("app/lib/logger");
const Member = require("app/model/wallet").members;
const memberMapper = require('app/feature/member/member.response-schema');
const bcrypt = require('bcrypt');
const Affiliate = require('app/lib/reward-system/affiliate');
const MemberStatus = require("app/model/wallet/value-object/member-status");
const MemberSetting = require('app/model/wallet').member_settings;

module.exports = async (req, res, next) => {
  try {
    const email = req.body.email.toLowerCase().trim();
    let emailExists = await Member.findOne({
      where: {
        deleted_flg: false,
        email,
      }
    });

    if (emailExists) {
      return res.badRequest(res.__("EMAIL_EXISTS_ALREADY"), "EMAIL_EXISTS_ALREADY", { fields: ['email'] });
    }

    let deactivateAccount = await Member.findOne({
      where: {
        deleted_flg: true,
        email: email,
      }
    });

    if (deactivateAccount) {
      return res.badRequest(res.__("EMAIL_DEACTIVATED"), "EMAIL_DEACTIVATED", { fields: ['email'] });
    }
    return _createAccount(req, res, next);
  }
  catch (err) {
    logger.error('register fail:', err);
    next(err);
  }
}

async function _createAccount(req, res, next) {
  let { email, password, fullname, last_name, first_name } = req.body;
  email = email.toLowerCase().trim();
  let affiliateInfo = {};
  let createAffiliate = await Affiliate.register({ email, referrerCode: "" });
  if (createAffiliate.httpCode == 200) {
    affiliateInfo.referral_code = createAffiliate.data.data.code;
    affiliateInfo.referrer_code = req.body.referrer_code || "";
    affiliateInfo.affiliate_id = createAffiliate.data.data.client_affiliate_id;
  }
  else {
    return res.status(createAffiliate.httpCode).send(createAffiliate.data);
  }

  password = bcrypt.hashSync(password, 10);
  let member = await Member.create({
    email,
    password_hash: password,
    fullname,
    last_name,
    first_name,
    member_sts: MemberStatus.UNACTIVATED,
    phone: "",
    ...affiliateInfo,
    membership_type_id: null
  });

  if (!member) {
    return res.serverInternalError();
  }

  const memberSetting = await MemberSetting.create({ member_id: member.id });
  if (!memberSetting) {
    return res.serverInternalError();
  }

  let response = memberMapper(member);
  return res.ok(response);
}

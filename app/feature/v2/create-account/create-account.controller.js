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
        email,
      }
    });

    if (emailExists && undefined === emailExists.deleted_flg) {
      return res.badRequest(res.__("EMAIL_EXISTS_ALREADY"), "EMAIL_EXISTS_ALREADY", { fields: ['email'] });
    }

    if (emailExists
      && false === emailExists.deleted_flg
      && MemberStatus.UNACTIVATED === emailExists.member_sts) {
      return _updateAccount(req, res, next);
    }

    return _createAccount(req, res, next);
  }
  catch (err) {
    logger.error('register fail:', err);
    next(err);
  }
}

async function _createAccount(req, res, next) {
  let { email, password, full_name, last_name, first_name } = req.body;
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
    fullname: full_name,
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

async function _updateAccount(req, res, next) {
  let { email, password, full_name, last_name, first_name } = req.body;
  email = email.toLowerCase().trim();

  password = bcrypt.hashSync(password, 10);
  let [_, member] = await Member.update({
    password_hash: password,
    fullname: full_name,
    last_name,
    first_name,
  }, {
    where: {
      email
    },
    returning: true,
    plain: true
  });

  if (!member) {
    return res.serverInternalError();
  }

  let response = memberMapper(member);
  return res.ok(response);
}

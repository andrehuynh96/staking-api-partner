const logger = require("app/lib/logger");
const config = require("app/config");
const Member = require("app/model/wallet").members;
const OTP = require("app/model/wallet").otps;
const OtpType = require("app/model/wallet/value-object/otp-type");
const memberMapper = require('app/feature/member/member.response-schema');
const bcrypt = require('bcrypt');
const mailer = require('app/lib/mailer');
const uuidV4 = require('uuid/v4');
const Affiliate = require('app/lib/reward-system/affiliate');
const MemberStatus = require("app/model/wallet/value-object/member-status");
const EmailTemplateType = require('app/model/wallet/value-object/email-template-type')
const EmailTemplate = require('app/model/wallet').email_templates;
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

    if (req.body.phone) {
      let phoneExists = await Member.findOne({
        where: {
          deleted_flg: false,
          phone: req.body.phone
        }
      });

      if (phoneExists) {
        return res.badRequest(res.__("PHONE_EXISTS_ALREADY"), "PHONE_EXISTS_ALREADY", { fields: ['phone'] });
      }
    }

    let deactiveAccount = await Member.findOne({
      where: {
        deleted_flg: true,
        email: email,
      }
    });

    if (deactiveAccount) {
      return _activeAccount(deactiveAccount, req, res, next);
    }
    return _createAccount(req, res, next);
  }
  catch (err) {
    logger.error('register fail:', err);
    next(err);
  }
};

async function _activeAccount(member, req, res, next) {
  member.password_hash = bcrypt.hashSync(req.body.password, 10);
  member.member_sts = MemberStatus.UNACTIVATED;

  const now = new Date();
  let verifyToken = Buffer.from(uuidV4()).toString('base64');
  now.setHours(now.getHours() + config.expiredVefiryToken);
  await OTP.update({
    expired: true
  }, {
    where: {
      member_id: member.id,
      action_type: OtpType.REGISTER
    },
    returning: true
  });

  let otp = await OTP.create({
    code: verifyToken,
    used: false,
    expired: false,
    expired_at: now,
    member_id: member.id,
    action_type: OtpType.REGISTER
  });
  if (!otp) {
    return res.serverInternalError();
  }
  await member.save();
  _sendEmail(member, otp);
  let response = memberMapper(member);
  response.referral_code = "";
  return res.ok(response);
}

async function _createAccount(req, res, next) {
  const email = req.body.email.toLowerCase().trim();
  let affiliateInfo = {};
  let createAffiliate = await Affiliate.register({ email, referrerCode: req.body.referrer_code || "" });
  if (createAffiliate.httpCode == 200) {
    affiliateInfo.referral_code = createAffiliate.data.data.code;
    affiliateInfo.referrer_code = req.body.referrer_code || null;
    affiliateInfo.affiliate_id = createAffiliate.data.data.client_affiliate_id;
  }
  else {
    return res.status(createAffiliate.httpCode).send(createAffiliate.data);
  }

  let password = bcrypt.hashSync(req.body.password, 10);
  let member = await Member.create({
    email,
    password_hash: password,
    member_sts: MemberStatus.UNACTIVATED,
    phone: req.body.phone || "",
    ...affiliateInfo,
    membership_type_id: null,
    current_language: req.body.language,
    country: req.body.country
  });

  if (!member) {
    return res.serverInternalError();
  }

  const now = new Date();
  let verifyToken = Buffer.from(uuidV4()).toString('base64');
  now.setHours(now.getHours() + config.expiredVefiryToken);
  await OTP.update({
    expired: true
  }, {
    where: {
      member_id: member.id,
      action_type: OtpType.REGISTER
    },
    returning: true
  });

  let otp = await OTP.create({
    code: verifyToken,
    used: false,
    expired: false,
    expired_at: now,
    member_id: member.id,
    action_type: OtpType.REGISTER
  });
  if (!otp) {
    return res.serverInternalError();
  }

  const memberSetting = await MemberSetting.create({ member_id: member.id });
  if (!memberSetting) {
    return res.serverInternalError();
  }

  _sendEmail(member, otp);
  member.referral_code = "";
  let response = memberMapper(member);
  return res.ok(response);
}

async function _sendEmail(member, otp) {
  try {
    let templateName = EmailTemplateType.VERIFY_EMAIL
    let template = await EmailTemplate.findOne({
      where: {
        name: templateName,
        language: member.current_language
      }
    })

    if (!template) {
      template = await EmailTemplate.findOne({
        where: {
          name: templateName,
          language: 'en'
        }
      })
    }

    if (!template) {
      logger.error(`EMAIL_TEMPLATE_NOT_FOUND: ${templateName}`);
      return;
    }

    let subject = `${config.emailTemplate.partnerName} - ${template.subject}`;
    let from = `${config.emailTemplate.partnerName} <${config.smtp.mailSendAs}>`;
    let data = {
      imageUrl: config.website.urlImages,
      link: `${config.website.urlActive}${otp.code}`,
      hours: config.expiredVefiryToken
    }
    data = Object.assign({}, data, config.email);
    await mailer.sendWithDBTemplate(subject, from, member.email, data, template.template);
  } catch (err) {
    logger.error("send email create account fail", err);
  }
} 
const logger = require("app/lib/logger");
const config = require("app/config");
const Member = require("app/model/wallet").members;
const OTP = require("app/model/wallet").otps;
const OtpType = require("app/model/wallet/value-object/otp-type");
const MemberStatus = require("app/model/wallet/value-object/member-status");
const mailer = require('app/lib/mailer');
const uuidV4 = require('uuid/v4');
const EmailTemplateType = require('app/model/wallet/value-object/email-template-type')
const EmailTemplate = require('app/model/wallet').email_templates;

module.exports = async (req, res, next) => {
  try {
    let member = await Member.findOne({
      where: {
        //deleted_flg: false,
        email: req.body.email.toLowerCase()
      }
    });

    if (!member) {
      return res.badRequest(res.__("NOT_FOUND_USER"), "NOT_FOUND_USER", { fields: ['email'] });
    }

    if (member.member_sts == MemberStatus.LOCKED) {
      return res.badRequest(res.__("ACCOUNT_LOCKED"), "ACCOUNT_LOCKED")
    }
    if (member.member_sts == MemberStatus.ACTIVATED) {
      return res.badRequest(res.__("ACCOUNT_ACTIVATED"), "ACCOUNT_ACTIVATED")
    }
    let verifyToken = Buffer.from(uuidV4()).toString('base64');
    let today = new Date();
    today.setHours(today.getHours() + config.expiredVefiryToken);
    await OTP.update({
      expired: true
    }, {
        where: {
          member_id: member.id
        },
        returning: true
      });
    let newOtp = await OTP.create({
      code: verifyToken,
      used: false,
      expired: false,
      expired_at: today,
      member_id: member.id,
      action_type: OtpType.REGISTER
    });
    if (!newOtp) {
      return res.serverInternalError();
    }

    await _sendEmail(member, newOtp);
    return res.ok(true);
  }
  catch (err) {
    logger.error('resend verify email fail:', err);
    next(err);
  }
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
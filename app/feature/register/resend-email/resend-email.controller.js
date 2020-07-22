const logger = require("app/lib/logger");
const config = require("app/config");
const Member = require("app/model/wallet").members;
const OTP = require("app/model/wallet").otps;
const OtpType = require("app/model/wallet/value-object/otp-type");
const MemberStatus = require("app/model/wallet/value-object/member-status");
const mailer = require('app/lib/mailer');
const uuidV4 = require('uuid/v4');

module.exports = async (req, res, next) => {
  try {
    let member = await Member.findOne({
      where: {
        deleted_flg: false,
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
    let subject = `${config.emailTemplate.partnerName} - Create Account`;
    let from = `${config.emailTemplate.partnerName} <${config.smtp.mailSendAs}>`;
    let data = {
      imageUrl: config.website.urlImages,
      link: `${config.website.urlActive}${otp.code}`,
      hours: config.expiredVefiryToken
    }
    await mailer.sendWithTemplate(subject, from, member.email, data, config.emailTemplate.verifyEmail);
  } catch (err) {
    logger.error("send email create account fail", err);
  }
} 
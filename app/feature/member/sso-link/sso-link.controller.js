const logger = require('app/lib/logger');
const Member = require('app/model/wallet').members;
const config = require('app/config');
const MemberStatus = require('app/model/wallet/value-object/member-status');
const MemberActivityLog = require('app/model/wallet').member_activity_logs;
const ActionType = require('app/model/wallet/value-object/member-activity-action-type');
const uuidV4 = require('uuid/v4');
const OTP = require('app/model/wallet').otps;
const OtpType = require('app/model/wallet/value-object/otp-type');

module.exports = async (req, res, next) => {
  try {
    const user = await Member.findOne({
      where: {
        id: req.user.id,
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

    const token = Buffer.from(uuidV4()).toString('base64');
    await _createOTP(user.id, token);
    await _writeActionLog(user.id, req);
    const ssoLink = `${config.website.ssoLoginUrl}${token}`;

    return res.ok({ ssoLink });
  }
  catch (err) {
    logger.error('Create SSO link:', err);

    next(err);
  }
};

async function _writeActionLog(memberId, req) {
  const registerIp = (req.headers['cf-connecting-ip'] || req.headers['x-forwarded-for'] || req.headers['x-client'] || req.ip).replace(/^.*:/, '');

  await MemberActivityLog.create({
    member_id: memberId,
    client_ip: registerIp,
    action: ActionType.SSO_TOKEN,
    user_agent: req.headers['user-agent']
  });
}

async function _createOTP(memberId, token) {
  let today = new Date();
  today.setHours(today.getHours() + config.expiredSSOToken);

  await OTP.update({
    expired: true
  }, {
      where: {
        member_id: memberId,
        action_type: OtpType.SSO_TOKEN
      },
      returning: true
    });

  await OTP.create({
    code: token,
    used: false,
    expired: false,
    expired_at: today,
    member_id: memberId,
    action_type: OtpType.SSO_TOKEN
  });
}
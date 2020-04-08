const logger = require('app/lib/logger');
const Member = require('app/model/wallet').members;
const MemberStatus = require('app/model/wallet/value-object/member-status');
const speakeasy = require('speakeasy');
const OTP = require('app/model/wallet').otps;
const OtpType = require('app/model/wallet/value-object/otp-type');
const MemberActivityLog = require('app/model/wallet').member_activity_logs;
const ActionType = require('app/model/wallet/value-object/member-activity-action-type');
const uuidV4 = require('uuid/v4');
const jwt = require("jsonwebtoken");
const config = require("app/config");
const Token = require('app/model/wallet').member_tokens;

module.exports = async (req, res, next) => {
  try {
    let otp = await OTP.findOne({
      where: {
        code: req.body.verify_token,
        action_type: OtpType.TWOFA_MOBILE
      }
    });
    if (!otp) {
      return res.badRequest(res.__('TOKEN_INVALID'), 'TOKEN_INVALID', { fields: ['verify_token'] });
    }

    let today = new Date();
    if (otp.expired_at < today || otp.expired || otp.used) {
      return res.badRequest(res.__('TOKEN_EXPIRED'), 'TOKEN_EXPIRED', { fields: ['verify_token'] });
    }

    let user = await Member.findOne({
      where: {
        id: otp.member_id
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

    var verified = speakeasy.totp.verify({
      secret: user.twofa_secret,
      encoding: 'base32',
      token: req.body.twofa_code,
    });

    if (!verified) {
      return res.badRequest(res.__('TWOFA_CODE_INCORRECT'), 'TWOFA_CODE_INCORRECT', { fields: ['twofa_code'] });
    }

    await OTP.update({
      used: true
    }, {
        where: {
          id: otp.id
        },
      });

    await _writeActionLog(user.id, req);
    let token = _generateToken(user);
    await _writeToken(user, token);
    return res.ok(token);
  }
  catch (err) {
    logger.error('login fail: ', err);
    next(err);
  }
};

async function _writeActionLog(memberId, req) {
  const registerIp = (req.headers['cf-connecting-ip'] || req.headers['x-forwarded-for'] || req.headers['x-client'] || req.ip).replace(/^.*:/, '');

  await MemberActivityLog.create({
    member_id: memberId,
    client_ip: registerIp,
    action: ActionType.LOGIN,
    user_agent: req.headers['user-agent']
  });
}


function _generateToken(member) {
  var payload = {
    id: member.id,
    member_id: member.id,
    email: member.email,
    fullname: member.fullname,
  };
  let accessToken = jwt.sign(payload, config.token.key.private, config.token.signOption);
  let refreshToken = Buffer.from(uuidV4()).toString('base64');
  return {
    access_token: accessToken,
    refresh_token: refreshToken,
    expires_in: config.token.signOption.expiresIn - 10,
    token_type: 'Bearer'
  };
}

async function _writeToken(member, token) {
  let today = new Date();
  today.setSeconds(today.getSeconds() + token.expires_in);
  let refreshExpired = new Date();
  refreshExpired.setSeconds(refreshExpired.getSeconds() + config.token.refreshTokenExpiresIn);

  await Token.create({
    member_id: member.id,
    access_token: token.access_token,
    refresh_token: token.refresh_token,
    access_token_expire_at: today,
    refresh_token_expire_at: refreshExpired
  });
}
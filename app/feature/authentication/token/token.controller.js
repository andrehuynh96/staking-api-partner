const Sequelize = require('sequelize');
const logger = require("app/lib/logger");
const config = require("app/config");
const Token = require('app/model/wallet').member_tokens;
const Member = require('app/model/wallet').members;
const MemberActivityLog = require('app/model/wallet').member_activity_logs;
const OTP = require('app/model/wallet').otps;
const MemberStatus = require('app/model/wallet/value-object/member-status');
const ActionType = require('app/model/wallet/value-object/member-activity-action-type');
const OtpType = require('app/model/wallet/value-object/otp-type');
const bcrypt = require('bcrypt');
const uuidV4 = require('uuid/v4');
const jwt = require("jsonwebtoken");

module.exports = async (req, res, next) => {
  try {
    let user = await Member.findOne({
      where: {
        email: req.body.email.toLowerCase(),
        deleted_flg: false
      }
    });
    if (!user) {
      return res.badRequest(res.__("USER_NOT_FOUND"), "USER_NOT_FOUND", { fields: ["email"] });
    }

    if (user.member_sts == MemberStatus.LOCKED) {
      return res.forbidden(res.__("ACCOUNT_LOCKED"), "ACCOUNT_LOCKED");
    }

    if (user.member_sts == MemberStatus.UNACTIVATED) {
      return res.forbidden(res.__("UNCONFIRMED_ACCOUNT"), "UNCONFIRMED_ACCOUNT");
    }

    const match = await bcrypt.compare(req.body.password, user.password_hash);
    if (!match) {
      if (user.attempt_login_number + 1 <= config.lockUser.maximumAttemptsLogin) {
        await Member.update({
          attempt_login_number: user.attempt_login_number + 1,
          latest_login_at: Sequelize.fn('NOW')
        }, {
          where: {
            id: user.id
          }
        })
        if (user.attempt_login_number + 1 == config.lockUser.maximumAttemptsLogin) {
          return res.forbidden(res.__("ACCOUNT_TEMPORARILY_LOCKED_DUE_TO_MANY_WRONG_ATTEMPTS"), "ACCOUNT_TEMPORARILY_LOCKED_DUE_TO_MANY_WRONG_ATTEMPTS");
        }
        else {
          return res.unauthorized(res.__("LOGIN_FAIL"), "LOGIN_FAIL");
        }
      }
      else {
        return res.forbidden(res.__("ACCOUNT_TEMPORARILY_LOCKED_DUE_TO_MANY_WRONG_ATTEMPTS"), "ACCOUNT_TEMPORARILY_LOCKED_DUE_TO_MANY_WRONG_ATTEMPTS");
      }
    }
    else {
      let nextAcceptableLogin = new Date(user.latest_login_at ? user.latest_login_at : null);
      nextAcceptableLogin.setMinutes(nextAcceptableLogin.getMinutes() + parseInt(config.lockUser.lockTime));

      let rightNow = new Date();
      if (nextAcceptableLogin >= rightNow && user.attempt_login_number >= config.lockUser.maximumAttemptsLogin) {
        return res.forbidden(res.__("ACCOUNT_TEMPORARILY_LOCKED_DUE_TO_MANY_WRONG_ATTEMPTS"), "ACCOUNT_TEMPORARILY_LOCKED_DUE_TO_MANY_WRONG_ATTEMPTS");
      }

      await Member.update({
        attempt_login_number: 0,
        latest_login_at: Sequelize.fn('NOW')
      }, {
        where: {
          id: user.id
        }
      })
    }

    if (user.twofa_enable_flg) {
      let verifyToken = Buffer.from(uuidV4()).toString('base64');
      await _createOTP(user.id, verifyToken);
      return res.ok({
        twofa: true,
        verify_token: verifyToken
      });
    }
    else {
      await _writeActionLog(user.id, req);
      let token = _generateToken(user);
      await _writeToken(user, token);
      return res.ok({
        twofa: false,
        token: token
      });
    }
  }
  catch (err) {
    logger.error("login fail: ", err);
    next(err);
  }
}

async function _writeActionLog(memberId, req) {
  const registerIp = (req.headers['cf-connecting-ip'] || req.headers['x-forwarded-for'] || req.headers['x-client'] || req.ip).replace(/^.*:/, '');

  await MemberActivityLog.create({
    member_id: memberId,
    client_ip: registerIp,
    action: ActionType.LOGIN,
    user_agent: req.headers['user-agent']
  });
}

async function _createOTP(memberId, verifyToken) {
  let today = new Date();
  today.setHours(today.getHours() + config.expiredVefiryToken);

  await OTP.update({
    expired: true
  }, {
    where: {
      member_id: memberId,
      action_type: OtpType.TWOFA_MOBILE
    },
    returning: true
  })

  await OTP.create({
    code: verifyToken,
    used: false,
    expired: false,
    expired_at: today,
    member_id: memberId,
    action_type: OtpType.TWOFA_MOBILE
  })
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
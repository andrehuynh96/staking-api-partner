const logger = require('app/lib/logger');
const Member = require('app/model/wallet').members;
const MemberStatus = require('app/model/wallet/value-object/member-status');
const MemberActivityLog = require('app/model/wallet').member_activity_logs;
const ActionType = require('app/model/wallet/value-object/member-activity-action-type');
const uuidV4 = require('uuid/v4');
const jwt = require("jsonwebtoken");
const config = require("app/config");
const Token = require('app/model/wallet').member_tokens;

module.exports = async (req, res, next) => {
  try {
    let token = await Token.findOne({
      where: {
        refresh_token: req.body.refresh_token,
        revoked: false
      }
    });
    if (!token) {
      return res.badRequest(res.__('REFRESH_TOKEN_INVALID'), 'REFRESH_TOKEN_INVALID', { fields: ['refresh_token'] });
    }

    let today = new Date();
    if (token.refresh_token_expire_at < today) {
      return res.badRequest(res.__('REFRESH_TOKEN_EXPIRED'), 'REFRESH_TOKEN_EXPIRED', { fields: ['refresh_token'] });
    }

    let user = await Member.findOne({
      where: {
        id: token.member_id
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

    await Token.update({
      revoked: true
    }, {
        where: {
          id: token.id
        },
      });

    await _writeActionLog(user.id, req);
    let newToken = _generateToken(user);
    await _writeToken(user, newToken);
    return res.ok(newToken);
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
    action: ActionType.REFRESH_TOKEN,
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
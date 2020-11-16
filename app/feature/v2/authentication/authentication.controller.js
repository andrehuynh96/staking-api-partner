const Sequelize = require('sequelize');
const logger = require("app/lib/logger");
const config = require("app/config");
const APIKey = require('app/model/wallet').api_keys;
const Member = require('app/model/wallet').members;
const MemberStatus = require('app/model/wallet/value-object/member-status');
const ActionType = require('app/model/wallet/value-object/member-activity-action-type');
const GrantType = require('app/model/wallet/value-object/sso-grant-type');
const Token = require('app/model/wallet').member_tokens;
const bcrypt = require('bcrypt');
const uuidV4 = require('uuid/v4');
const jwt = require("jsonwebtoken");

module.exports = async (req, res, next) => {
  try {
    let body = req.body;
    let checkInputData = _checkInputData(req.body);
    if (checkInputData.code != "") {
      return res.badRequest(res.__(checkInputData.code), checkInputData.code, { fields: checkInputData.fields });
    }

    let key = await APIKey.findOne({
      where: {
        api_key: body.client_id,
        secret: body.client_secret,
        actived_flg: true
      }
    });
    if (!key) {
      return res.badRequest(res.__("NOT_FOUND_CLIENT"), "NOT_FOUND_CLIENT", { fields: ["client_id", "client_secret"] });
    }

    let member;
    switch (body.grant_type) {
      case GrantType.PASSWORD:
        {
          member = await Member.findOne({
            where: {
              email: body.username.toLowerCase(),
              deleted_flg: false
            }
          });
          if (!member) {
            return res.badRequest(res.__("LOGIN_FAIL"), "LOGIN_FAIL", { fields: ["username", "password"] });
          }
          if (member.member_sts == MemberStatus.LOCKED) {
            return res.forbidden(res.__("ACCOUNT_LOCKED"), "ACCOUNT_LOCKED");
          }
          if (member.member_sts == MemberStatus.UNACTIVATED) {
            return res.forbidden(res.__("UNCONFIRMED_ACCOUNT"), "UNCONFIRMED_ACCOUNT");
          }
          const match = await bcrypt.compare(body.password, member.password_hash);
          if (!match) {
            return res.badRequest(res.__("LOGIN_FAIL"), "LOGIN_FAIL", { fields: ["username", "password"] });
          }

          break;
        }
      case GrantType.PASSWORDLESS:
        {
          member = await Member.findOne({
            where: {
              email: body.username.toLowerCase(),
              deleted_flg: false
            }
          });
          if (!member) {
            return res.badRequest(res.__("LOGIN_FAIL"), "LOGIN_FAIL", { fields: ["username"] });
          }
          if (member.member_sts == MemberStatus.LOCKED) {
            return res.forbidden(res.__("ACCOUNT_LOCKED"), "ACCOUNT_LOCKED");
          }
          if (member.member_sts == MemberStatus.UNACTIVATED) {
            return res.forbidden(res.__("UNCONFIRMED_ACCOUNT"), "UNCONFIRMED_ACCOUNT");
          }
          break;
        }
      case GrantType.REFRESH_TOKEN:
        {
          let token = await Token.findOne({
            where: {
              refresh_token: body.refresh_token,
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

          if (token.member_id) {
            member = await Member.findOne({
              where: {
                id: token.member_id
              }
            });
          }

          await Token.update({
            revoked: true
          },
            {
              where: {
                id: token.id
              }
            }
          )

          break;
        }
    }

    let token = _generateToken(key, (member ? member.id : null), (member ? member.email : null));
    await _writeToken(member, token, body.grant_type);
    return res.ok(token);
  }
  catch (err) {
    logger.error('login fail: ', err);
    next(err);
  }
}

function _checkInputData(data) {
  if (!data.client_id || !data.client_secret || !data.grant_type) {
    return {
      code: "MISSING_PARAMETER",
      fields: ["client_id", "client_secret", "grant_type"]
    }
  }

  if (!Object.values(GrantType).includes(data.grant_type)) {
    return {
      code: "UNSUPPORT_GRANT_TYPE",
      fields: []
    }
  }

  switch (data.grant_type) {
    case GrantType.PASSWORD:
      {
        if (!data.username || !data.password) {
          return {
            code: "MISSING_PARAMETER",
            fields: ["username", "password"]
          }
        }
        break;
      }
    case GrantType.PASSWORDLESS:
      {
        if (!data.username) {
          return {
            code: "MISSING_PARAMETER",
            fields: ["username"]
          }
        }
        break;
      }
    case GrantType.REFRESH_TOKEN:
      {
        if (!data.refresh_token) {
          return {
            code: "MISSING_PARAMETER",
            fields: ["refresh_token"]
          }
        }
        break;
      }
  }

  return {
    code: "",
    fields: []
  }
}


function _generateToken(client, memberId, email) {
  var payload = {
    client_id: client.api_key,
    member_id: memberId,
    email: email,
    user_id: memberId,
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

async function _writeToken(member, token, grantType) {
  let today = new Date();
  today.setSeconds(today.getSeconds() + token.expires_in);
  let refreshExpired = new Date();
  refreshExpired.setSeconds(refreshExpired.getSeconds() + config.token.refreshTokenExpiresIn);

  await Token.create({
    member_id: member ? member.id : null,
    access_token: token.access_token,
    refresh_token: token.refresh_token,
    access_token_expire_at: today,
    refresh_token_expire_at: refreshExpired,
    grant_type: grantType
  });
}
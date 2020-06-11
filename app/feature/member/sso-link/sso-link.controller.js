const logger = require('app/lib/logger');
const Member = require('app/model/wallet').members;
const config = require("app/config");
const PluTXUserIdApi = require('app/lib/plutx-userid');
const Token = require('app/model/wallet').member_tokens;
const MemberStatus = require('app/model/wallet/value-object/member-status');

module.exports = async (req, res, next) => {
  try {
    const { body } = req;
    const { refresh_token } = body;
    const token = await Token.findOne({
      where: {
        refresh_token: refresh_token,
        revoked: false,
      }
    });
    if (!token) {
      return res.badRequest(res.__('REFRESH_TOKEN_INVALID'), 'REFRESH_TOKEN_INVALID', { fields: ['refresh_token'] });
    }

    if (token.isExpired) {
      return res.badRequest(res.__('REFRESH_TOKEN_EXPIRED'), 'REFRESH_TOKEN_EXPIRED', { fields: ['refresh_token'] });
    }

    const user = await Member.findOne({
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

    // TODO: We use email to get SSO token for mobile app,
    // will implement after integrate with PluTX UserID
    const createSsoTokenResult = await PluTXUserIdApi.createSsoToken(user.plutx_userid_id, user.email);
    if (createSsoTokenResult.httpCode !== 200) {
      return res.status(createSsoTokenResult.httpCode).send(createSsoTokenResult.data);
    }

    const tokenId = createSsoTokenResult.data.id;
    const ssoLink = `${config.website.ssoLoginUrl}${tokenId}`;

    return res.ok({ ssoLink });
  }
  catch (err) {
    logger.error('Create SSO link:', err);

    next(err);
  }
};

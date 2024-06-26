const logger = require('app/lib/logger');
const Wallet = require('app/model/wallet').wallets;
const WalletPrivateKey = require('app/model/wallet').wallet_priv_keys;
const WalletToken = require('app/model/wallet').wallet_tokens;
const database = require('app/lib/database').db().wallet;
const Member = require('app/model/wallet').members;
const mapper = require('./wallet.response-schema');
const config = require('app/config');
const speakeasy = require('speakeasy');

var wallet = {};

wallet.getAll = async (req, res, next) => {
  try {
    logger.info('wallet::all');
    const { query: { offset, limit, default_flg }, user } = req;
    const where = { deleted_flg: false, member_id: user.id };
    if (default_flg != undefined) {
      where.default_flg = default_flg;
    }
    const off = parseInt(offset) || 0;
    const lim = parseInt(limit) || parseInt(config.appLimit);

    const { count: total, rows: wallets } = await Wallet.findAndCountAll({ offset: off, limit: lim, where: where, order: [['created_at', 'DESC']] });
    return res.ok({
      items: mapper(wallets),
      offset: off,
      limit: lim,
      total: total
    });
  }
  catch (err) {
    logger.error("get wallets fail: ", err);
    next(err);
  }
}

wallet.create = async (req, res, next) => {
  let transaction;
  try {
    logger.info('wallet::create');
    let user = await Member.findOne({
      where: {
        id: req.user.id,
        deleted_flg: false
      }
    });
    if (!user) {
      return res.badRequest(res.__('USER_NOT_FOUND'), 'USER_NOT_FOUND');
    }

    transaction = await database.transaction();

    if (req.body.default_flg) {
      await Wallet.update({ default_flg: false }, {
        where: {
          member_id: req.user.id,
          default_flg: true
        }, returning: true
      }, { transaction });
    }

    let data = {
      member_id: req.user.id,
      name: req.body.name,
      default_flg: req.body.default_flg ? req.body.default_flg : false,
      encrypted_passphrase: req.body.encrypted_passphrase
    }
    let wallet = await Wallet.create(data, { transaction });
    await transaction.commit();
    return res.ok(mapper(wallet));
  } catch (ex) {
    logger.error(ex);
    if (transaction) await transaction.rollback();
    next(ex);
  }
}

wallet.update = async (req, res, next) => {
  let transaction;
  try {
    logger.info('wallet::update');
    const { params: { id }, body } = req;
    let wallet = await Wallet.findOne({
      where: {
        id: id,
        member_id: req.user.id
      }
    });
    if (!wallet) {
      return res.badRequest(res.__("WALLET_NOT_FOUND"), "WALLET_NOT_FOUND");
    }

    transaction = await database.transaction();

    if (body.default_flg) {
      await Wallet.update({ default_flg: false }, {
        where: {
          member_id: req.user.id,
          default_flg: true
        }, returning: true
      }, { transaction });
    }
    let [_, [result]] = await Wallet.update(body, {
      where: {
        id: id
      }, returning: true
    }, { transaction });
    await transaction.commit();
    return res.ok(mapper(result));
  } catch (ex) {
    logger.error(ex);
    if (transaction) await transaction.rollback();
    next(ex);
  }
}

wallet.delete = async (req, res, next) => {
  let transaction;
  try {
    logger.info('wallet::delete');
    const { params: { id } } = req;
    let wallet = await Wallet.findOne({
      where: {
        id: id,
        member_id: req.user.id
      }
    });
    if (!wallet) {
      return res.badRequest(res.__("WALLET_NOT_FOUND"), "WALLET_NOT_FOUND");
    }

    transaction = await database.transaction();

    await WalletPrivateKey.update({ deleted_flg: true }, { where: { wallet_id: id } }, { transaction });
    await WalletToken.update({ deleted_flg: true }, { where: { wallet_id: id } }, { transaction });
    await Wallet.update({ deleted_flg: true }, { where: { id: id } }, { transaction });
    await transaction.commit();
    return res.ok({ deleted: true });
  } catch (error) {
    logger.error(error);
    if (transaction) await transaction.rollback();
    next(error);
  }
};

wallet.getPassphrase = async (req, res, next) => {
  try {
    const { params: { wallet_id }, query: { twofa_code } } = req;

    let user = await Member.findOne({
      where: {
        id: req.user.id,
        deleted_flg: false
      }
    });

    if (user.twofa_download_key_flg) {
      var verified = speakeasy.totp.verify({
        secret: user.twofa_secret,
        encoding: 'base32',
        token: twofa_code,
        window: config.twofaStep
      });
      if (!verified) {
        return res.badRequest(res.__('TWOFA_CODE_INCORRECT'), 'TWOFA_CODE_INCORRECT', { fields: ['twofa_code'] });
      }
    }

    let wallet = await Wallet.findOne({
      where: {
        id: wallet_id,
        member_id: req.user.id
      }
    });
    if (!wallet) {
      return res.badRequest(res.__("WALLET_NOT_FOUND"), "WALLET_NOT_FOUND");
    }
    return res.ok({ encrypted_passphrase: wallet.encrypted_passphrase });
  } catch (ex) {
    logger.error(ex);
    next(ex);
  }
}

module.exports = wallet;
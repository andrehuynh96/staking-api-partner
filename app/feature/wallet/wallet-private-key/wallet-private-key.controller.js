const logger = require('app/lib/logger');
const Wallet = require('app/model/wallet').wallets;
const WalletPrivateKey = require('app/model/wallet').wallet_priv_keys;
const Member = require('app/model/wallet').members;
const mapper = require('./wallet-private-key.response-schema');
const speakeasy = require('speakeasy');
const config = require('app/config');
const database = require('app/lib/database').db().wallet;
const WalletToken = require('app/model/wallet').wallet_tokens;

var privkey = {};

privkey.create = async (req, res, next) => {
  try {
    logger.info('wallet private key::create');
    const { params: { wallet_id } } = req;
    let wallet = await Wallet.findOne({
      where: {
        id: wallet_id,
        member_id: req.user.id
      }
    });
    if (!wallet) {
      return res.badRequest(res.__("WALLET_NOT_FOUND"), "WALLET_NOT_FOUND");
    }
    let items = [];
    for (item of req.body.items) {
      let data = {
        wallet_id: wallet_id,
        platform: item.platform,
        address: item.address,
        hd_path: item.hd_path,
        encrypted_private_key: item.encrypted_private_key
      }
      items.push(data);
    }
    let results = await WalletPrivateKey.bulkCreate(items);
    return res.ok(mapper(results));
  } catch (ex) {
    logger.error(ex);
    next(ex);
  }
}


privkey.delete = async (req, res, next) => {
  let transaction;
  try {
    logger.info('wallet private key::delete');
    const { params: { wallet_id, id } } = req;
    let wallet = await Wallet.findOne({
      where: {
        id: wallet_id,
        member_id: req.user.id
      }
    });
    if (!wallet) {
      return res.badRequest(res.__("WALLET_NOT_FOUND"), "WALLET_NOT_FOUND");
    }

    let key = await WalletPrivateKey.findOne({
      where: {
        id: id
      }
    });
    if (!key) {
      return res.badRequest(res.__("COIN_NOT_FOUND"), "COIN_NOT_FOUND")
    }
    transaction = await database.transaction();
    await WalletToken.update({ deleted_flg: true }, { where: { wallet_id: wallet_id, platform: key.platform } }, { transaction });
    await WalletPrivateKey.update({ deleted_flg: true }, { where: { id: id } }, { transaction });
    await transaction.commit();
    return res.ok({ deleted: true });
  } catch (error) {
    logger.error(error);
    if (transaction) await transaction.rollback();
    next(error);
  }
};

privkey.getPrivKey = async (req, res, next) => {
  try {
    const { params: { wallet_id, id }, body: { twofa_code } } = req;
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
    let priv = await WalletPrivateKey.findOne({
      where: {
        id: id
      }
    })
    if (!priv) {
      return res.badRequest(res.__("COIN_NOT_FOUND"), "COIN_NOT_FOUND")
    }
    return res.ok({ encrypted_private_key: priv.encrypted_private_key });
  } catch (ex) {
    logger.error(ex);
    next(ex);
  }
}

privkey.get = async (req, res, next) => {
  try {
    logger.info('coins::all');
    const { query: { offset, limit }, params: { wallet_id } } = req;
    const where = { deleted_flg: false, wallet_id: wallet_id };

    const off = parseInt(offset) || 0;
    const lim = parseInt(limit) || parseInt(config.appLimit);

    const { count: total, rows: wallet_priv_keys } = await WalletPrivateKey.findAndCountAll({ offset: off, limit: lim, where: where, order: [['platform', 'ASC']] });
    return res.ok({
      items: mapper(wallet_priv_keys),
      offset: off,
      limit: lim,
      total: total
    });
  }
  catch (err) {
    logger.error("get coins: ", err);
    next(err);
  }
}
privkey.getKey = async (req, res, next) => {
  try {
    logger.info('key::get');
    const { params: { wallet_id, id } } = req;
    const where = { deleted_flg: false, wallet_id: wallet_id, id: id };
    let key = await WalletPrivateKey.findOne({ where: where });
    if (!key) {
      return res.badRequest();
    } else {
      return res.ok(mapper(key));
    }
  }
  catch (err) {
    logger.error("get key: ", err);
    next(err);
  }
}

module.exports = privkey;
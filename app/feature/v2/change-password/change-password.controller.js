const logger = require('app/lib/logger');
const Member = require('app/model/wallet').members;
const bcrypt = require('bcrypt');

module.exports = {
  changePassword: async (req, res, next) => {
    try {
      const { params, body } = req;
      const member = await Member.findOne({
        where: {
          id: params.id
        }
      });
      if (!member) {
        return res.badRequest(res.__('USER_NOT_FOUND'), 'USER_NOT_FOUND');
      }
      const password_hash = bcrypt.hashSync(body.password, 10);
      const [_, response] = await Member.update({
        password_hash: password_hash
      }, {
        where: {
          id: params.id
        },
        returning: true,
        plain: true
      });
      if (!response) {
        res.serverInternalError();
      }
      return res.ok(true);
    } catch (error) {
      logger.error(error);
      next(error);
    }
  }
};
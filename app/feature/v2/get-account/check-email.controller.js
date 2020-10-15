const Member = require('app/model/wallet').members;
const logger = require('app/lib/logger');

module.exports = async (req, res, next) => {
  try {
    let member = await Member.findOne({
      where: {
        email: req.body.email
      }
    });

    if (!member) {
      return res.notFound(res.__('EMAIL_NOT_FOUND'), 'EMAIL_NOT_FOUND');
    }

    return res.ok(true);
  } catch (error) {
    logger.error(error);
    next(error);
  }
};

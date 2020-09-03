const logger = require('app/lib/logger');
const config = require('app/config');
const stakingApi = require('app/lib/staking-api')

module.exports = {
  get: async (req, res, next) => {
    try {
      let platform = req.params.platform ? req.params.platform.toUpperCase() : null;
      let result = await stakingApi.getValidators(platform);
      return res.status(result.httpCode).send(result.data);
    }
    catch (err) {
      logger.error('get list validator fail:', err);
      next(err);
    }
  }
}
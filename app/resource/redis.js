const config = require('app/config');
const keys = {
  stakingApi: {
    token: `${config.redis.prefix}:stakingapi:token`,
  },
  rewardSystem: {
    token: `${config.redis.prefix}:affiliate:token`,
  },
  plutxUserID: {
    token: `${config.redis.prefix}:plutx-userid:token`,
  },
  polkadot: {
    reward: `${config.redis.prefix}:polkadot:reward`,
    eras: `${config.redis.prefix}:polkadot:eras`,
    currentEra: `${config.redis.prefix}:polkadot:era:current:${config.dotEraPeriod}`,
  },
};

String.prototype.withParams = function (...params) {
  let str = this;
  if (params && params.length > 0) {
    params.forEach(item => {
      str += ':' + item;
    });
  }

  return str;
};

module.exports = Object.assign({}, keys);
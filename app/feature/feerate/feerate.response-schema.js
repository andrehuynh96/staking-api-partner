const objectMapper = require('object-mapper');

const destObject = {
  array: {
    '[].id': '[].id',
    '[].name': '[].name',
    '[].symbol': '[].symbol',
    '[].high': '[].high',
    '[].medium': '[].medium',
    '[].low': '[].low',
    '[].createdAt': '[].created_at',
    '[].updatedAt': '[].updated_at'
  },
  single: {
    id: 'id',
    name: 'name',
    symbol: 'symbol',
    high: 'high',
    medium: 'medium',
    low: 'low',
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
};
module.exports = srcObject => {
  if (Array.isArray(srcObject)) {
    if (srcObject === undefined || srcObject.length == 0) {
      return srcObject;
    } else {
      return objectMapper(srcObject, destObject.array);
    }
  }
  else {
    let result = objectMapper(srcObject, destObject.single);
    if (result) {
      result.hig = result.high;
    }

    return result;
  }
}; 
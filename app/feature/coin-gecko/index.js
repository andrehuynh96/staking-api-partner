const express = require('express');
const router = express.Router();
router.use('/coin-gecko',require('./coin/coin.route'));
router.use('/coin-gecko',require('./token/token.route'));
module.exports = router;
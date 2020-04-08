const express = require('express');
const router = express.Router();
router.use('/authentication', require('./token/token.route'));
router.use('/authentication', require('./confirm-2fa/confirm-2fa.route'));
router.use('/authentication', require('./refresh-token/refresh-token.route'));

module.exports = router;

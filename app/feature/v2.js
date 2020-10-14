const express = require('express');
const router = express.Router();

router.use(require('./v2/authentication/authentication.route'));
router.use(require('./v2/accounts/member-info.route'));

module.exports = router;

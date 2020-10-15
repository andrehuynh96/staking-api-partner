const express = require('express');
const router = express.Router();

router.use(require('./v2/authentication/authentication.route'));
router.use(require('./v2/get-account/member-info.route'));
router.use(require('./v2/update-account/update-account.route'));
router.use(require('./v2/get-account/check-email.route'));
router.use(require('./v2/create-account/create-account.route'));

module.exports = router;

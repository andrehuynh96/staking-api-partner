const express = require("express");
const router = express.Router();

router.use('/accounts', require('./profile/profile.route'));
router.use('/accounts', require('./sso-link/sso-link.route'));

module.exports = router;
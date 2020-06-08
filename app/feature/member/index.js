const express = require("express");
const router = express.Router();

router.use('/accounts', require('./profile/profile.route'));

module.exports = router;
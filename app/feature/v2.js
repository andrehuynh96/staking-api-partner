const express = require('express');
const router = express.Router();

router.use(require('./v2/authentication/authentication.route'));

module.exports = router;

const express = require('express');
const router = express.Router();
router.use('/accounts', require('./register/register.route'));
router.use('/accounts', require('./resend-email/resend-email.route'));

module.exports = router;
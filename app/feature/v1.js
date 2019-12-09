const express = require('express');
const router = express.Router();

router.use(require("./platform-vote/platform-vote.route"));

module.exports = router;

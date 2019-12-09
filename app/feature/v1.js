const express = require('express');
const router = express.Router();

router.use(require("./platform-vote/platform-vote.route"));
router.use(require("./tracking-voting/tracking-voting.route"));

module.exports = router;

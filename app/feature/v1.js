const express = require('express');
const router = express.Router();

router.use(require("./platform-vote/platform-vote.route"));
router.use(require("./tracking-voting/tracking-voting.route"));

// ERC20
router.use(require("./erc20/plan/plan.route"));
router.use(require("./erc20/deposit/erc20.route"));

// Wallet 
router.use(require('./wallet/wallet.route'));

module.exports = router;

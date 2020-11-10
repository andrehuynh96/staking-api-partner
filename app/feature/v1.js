const express = require('express');
const router = express.Router();

router.use(require('./platform-vote/platform-vote.route'));
router.use(require('./tracking-voting/tracking-voting.route'));

// ERC20
router.use(require('./erc20/plan/plan.route'));
router.use(require('./erc20/deposit/erc20.route'));

// Wallet 
router.use(require('./wallet/wallet.route'));

router.use(require('./authentication'));
router.use(require('./member'));
router.use(require('./currency/currency.route'));
router.use(require('./feerate/feerate.route'));
router.use(require('./register'));
router.use(require('./referral/referral.route'));
router.use(require('./validator/validator.route'));
router.use(require('./exchange'));

//  Point
router.use(require('./point/point.route'))
router.use(require('./point/tracking/tracking.route'))

//Bank
router.use('/bank', require('./bank'))

// Coin Gecko API
router.use(require('./coin-gecko'));

// Get Asset
router.use(require('./get-asset/get-asset.route'));

// Send Wyre
router.use('/fiat', require('./fiat'));
module.exports = router;

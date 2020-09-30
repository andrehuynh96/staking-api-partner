const express = require("express");
const router = express.Router();
router.use('/exchange', require("./currency/currency.route"));
router.use('/exchange', require("./get-min-amount/get-min-amount.route"));
router.use('/exchange', require("./estimate/estimate.route"));
router.use('/exchange', require("./make-transaction/make-transaction.route"));
router.use('/exchange', require("./transaction-history/transaction-history.route"));
router.use('/exchange', require("./transaction-detail/transaction-detail.route"));
router.use('/exchange', require("./update-transaction/update-transaction.route"));

module.exports = router;
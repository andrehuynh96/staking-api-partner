const config = require('app/config');
const express = require('express');
const router = express.Router();
const proxy = require('express-http-proxy');

router.use('/quras', proxy(config.quras_api, {
  proxyReqOptDecorator: function (proxyReqOpts, srcReq) {
    proxyReqOpts.rejectUnauthorized = false;
    console.log(proxyReqOpts)
    return proxyReqOpts;
  }
}));
module.exports = router; 
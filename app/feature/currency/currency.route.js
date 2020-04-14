const express = require('express');
const controller = require('./currency.controller');

const router = express.Router();

router.get(
  '/currencies',
  controller.getAll
);


module.exports = router;


/*********************************************************************/


/**
 * @swagger
 * /api/v1/currencies:
 *   get:
 *     summary: currency list
 *     tags:
 *       - Currency
 *     description:
 *     parameters:
 *       - name: offset
 *         in: query
 *         type: integer
 *         format: int32
 *       - name: limit
 *         in: query
 *         type: integer
 *         format: int32
 *       - name: search
 *         in: query
 *         type: string
 *       - name: default
 *         in: query
 *         type: boolean
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Ok
 *         examples:
 *           application/json:
 *             {
 *                 "data": {
                      "items": [
                        {
                          "id":"2",
                          "name":"Ethereum",
                          "symbol":"ETH",
                          "decimals": 18,
                          "icon":"https://static.chainservices.info/staking/platforms/eth.png",
                          "description":"AWS token",
                          "order_index":1,
                          "type":"NATIVE",
                          "platform": "ETH",
                          "sc_token_address":"0x423822D571Bb697dDD993c04B507dD40E754cF05",
                          "created_at":"2020-01-13T06:47:41.248Z",
                          "updated_at":"2020-01-13T06:47:41.248Z",
                          "default_flg": true,
                          "staking_flg": true,
                          "staking_info": {
                            "id":"3f76680510bcca07e7e011dcc1effb079d1d0a34",
                            "name":"Cosmos",
                            "symbol":"ATOM",
                            "icon":"https://static.chainservices.info/staking/platforms/cosmos.png",
                            "description":"The best platform for staking",
                            "order_index":1,
                            "estimate_earn_per_year":10.3,
                            "lockup_unvote":21,
                            "lockup_unvote_unit":"DAY",
                            "payout_reward":2,
                            "payout_reward_unit":"HOUR|DAY|MONTH|YEAR",
                            "status":"0|1",
                            "sc_lookup_addr":"",
                            "sc_token_address":"",
                            "erc20_duration":"",
                            "erc20_reward_estimate":"",
                            "erc20_validator_fee":"",
                          }
                        }
                      ],
                      "offset": 0,
                      "limit": 10,
                      "total": 1
 *                 }
 *             }
 *       400:
 *         description: Error
 *         schema:
 *           $ref: '#/definitions/400'
 *       401:
 *         description: Error
 *         schema:
 *           $ref: '#/definitions/401'
 *       404:
 *         description: Error
 *         schema:
 *           $ref: '#/definitions/404'
 *       500:
 *         description: Error
 *         schema:
 *           $ref: '#/definitions/500'
 */


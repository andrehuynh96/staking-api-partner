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
 *         description: Ok, status =1 is ENABLED, 2 is MAINTENANCE
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
                          "network":"mainnet",
                          "url": "https://blockscout.com/etc/mainnet",
                          "transactionFormatLink": "https://blockscout.com/etc/mainnet/tx/{0}",
                          "addressFormatLink": "https://blockscout.com/etc/mainnet/address/{0}",
                          "web_site_url": "https://ethereumclassic.org/",
                          "status": 1,
                          "default_flg": true,
                          "staking_flg": true,
                          "staking_info": {
                            "id": "36b7f440-1a3b-11ea-978f-2e728ce88125",
                            "platform": "ATOM",
                            "name": "COSMOS",
                            "symbol": "ATOM",
                            "icon": "https://terraform-state-web-wallet.s3-ap-southeast-1.amazonaws.com/images/cosmos-1582707426046.png",
                            "description": "1",
                            "order_index": 1,
                            "estimate_earn_per_year": "10",
                            "lockup_unvote": 21,
                            "lockup_unvote_unit": "DAY",
                            "payout_reward": 2,
                            "payout_reward_unit": "DAY",
                            "status": 1,
                            "confirmation_block": 6,
                            "staking_type": "NATIVE",
                            "sc_lookup_addr": "",
                            "sc_token_address": "",
                            "erc20_duration": "",
                            "erc20_reward_estimate": "",
                            "erc20_validator_fee": 0,
                            "validator_address": "cosmosvaloper1d504k5hhmxacapphj93m9k78gf9j295zfkgmxs"
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


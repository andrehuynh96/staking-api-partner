const express = require('express');
const parseUser = require('app/middleware/parse-user.middleware');
const controller = require('./currency.controller');

const router = express.Router();

router.get(
  '/currencies',
  parseUser,
  controller
);


module.exports = router;


/*********************************************************************/


/**
 * @swagger
 * /api/v1/exchange/currencies:
 *   get:
 *     summary: exchange currency list
 *     tags:
 *       - Exchange
 *     description:
 *     parameters:
 *       - name: authorization
 *         in: header
 *         schema:
 *           type: string
 *           example:
 *             Bearer access_token
 *       - name: fix_rate
 *         in: query
 *         required: false
 *         schema:
 *           type: boolean
 *           example:
 *             true
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Ok
 *         examples:
 *           application/json:
 *             {
 *                 "data":[
 *                      {
  *                       "id": 10,
                          "symbol": "REP",
                          "platform": "ETH",
                          "name": "Augur (REPv2)",
                          "icon": "https://web-api.changelly.com/api/coins/rep.png",
                          "decimals": null,
                          "description": "",
                          "contract_address": "0x221657776846890989a759ba2973e427dff5c9bb",
                          "contract_flg": true,
                          "order_index": 0,
                          "status": 1,
                          "from_flg": true,
                          "to_flg": true,
                          "fix_rate_flg": true,
                          "fixed_time": 900000,
                          "extra_id_name": ""
 *                      }
 *
 *                  ]
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


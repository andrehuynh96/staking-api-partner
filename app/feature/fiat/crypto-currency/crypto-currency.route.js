const express = require('express');
const authenticate = require('app/middleware/authenticate.middleware');
const controller = require('./crypto-currency.controller');

const router = express.Router();

router.get(
  '/crypto-currencies',
  authenticate,
  controller
);


module.exports = router;


/** *******************************************************************/


/**
 * @swagger
 * /api/v1/fiat/crypto-currencies:
 *   get:
 *     summary: get crypto currency
 *     tags:
 *       - Fiat
 *     description:
 *     parameters:
 *       - name: authorization
 *         in: header
 *         schema:
 *           type: string
 *           example:
 *             Bearer access_token
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
 *                       "id": 1,
                          "symbol": "BTC",
                          "platform": "BTC",
                          "name": "Bitcoin",
                          "icon": "https://web-api.changelly.com/api/coins/rep.png"
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


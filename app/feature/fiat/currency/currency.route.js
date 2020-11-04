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


/** *******************************************************************/


/**
 * @swagger
 * /api/v1/fiat/currencies:
 *   get:
 *     summary: get fiat currency
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
                          "symbol": "USD",
                          "name": "United States Dollars",
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


const express = require('express');
const authenticate = require('app/middleware/authenticate.middleware');
const controller = require('./currency.controller');
const router = express.Router();

router.get(
  '/currencies',
  authenticate,
  controller.get
);

module.exports = router;




/**********************************************************************/

/**
 * @swagger
 * /api/v1/bank/nexo/currencies:
 *   get:
 *     summary: get list currencies
 *     tags:
 *       - Bank
 *     description:
  *     parameters:
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Ok
 *         examples:
 *           application/json:
 *             {
 *              "data":   [
 *                  {
                        "id": "id",
                        "symbol": "symbol",
                        "name": "name",
                        "icon": "icon",
                        "description": "description",
                        "platform":"",
                        "decimals":10,
                        "contract_address":"",
                        "contract_flg":true
 *                  }
 *                 ]
 *              }
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
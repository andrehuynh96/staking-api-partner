const express = require('express');
const parseUser = require('app/middleware/parse-user.middleware');
const controller = require('./nexo-withdraw.controller');
const router = express.Router();
const validator = require('app/middleware/validator.middleware');
const { withdraw, verify } = require('./validator');
router.post(
  '/withdraw',
  validator(withdraw),
  parseUser,
  controller.withdraw
)

router.post(
  '/withdraw/verify',
  validator(verify),
  parseUser,
  controller.verify
)

module.exports = router;

/** ********************************************************************/

/**
 * @swagger
 * /api/v1/bank/nexo/withdraw:
 *   post:
 *     summary: create witdraw
 *     tags:
 *       - Bank
 *     description:
 *     parameters:
 *       - in: body
 *         name: data
 *         description: Data.
 *         schema:
 *            type: object
 *            required:
 *            - nexo_id
 *            - wallet_id
 *            - wallet_address
 *            - platform
 *            - amount
 *            - currency_id
 *            example:
 *               {
                    "nexo_id":"",
                    "wallet_id": "",
                    "wallet_address": "",
                    "platform": "",
                    "amount": 10,
                    "currency_id": "",
                    "tag": "",
                    "device_code": "",
                  }
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Ok
 *         examples:
 *           application/json:
 *             {
 *                 "data": {
                        "id": "id",
                        "wallet_id": "wallet_id",
                        "nexo_member_id": "nexo_member_id",
                        "nexo_id": "nexo_id",
                        "type": "type",
                        "platform": "platform",
                        "nexo_currency_id": "nexo_currency_id",
                        "amount": "amount",
                        "total_fee": "total_fee",
                        "address": "address",
                        "memo": "memo",
                        "short_name": "short_name",
                        "tx_id": "tx_id",
                        "status": "status",
                        "response": "response",
                        "nexo_transaction_id": "nexo_transaction_id",
                        "device_code": "device_code",
                        "created_at": "created_at",
                        "updated_at": "updated_at"
 *                  }
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

/**
 * @swagger
 * /api/v1/bank/nexo/withdraw/verify:
 *   post:
 *     summary: verify withdraw nexo
 *     tags:
 *       - Bank
 *     description:
 *     parameters:
 *       - in: body
 *         name: data
 *         description: Data.
 *         schema:
 *            type: object
 *            required:
 *            - nexo_id
 *            - code
 *            - nexo_transaction_id
 *            example:
 *               {
 *                  "nexo_id": "",
                    "code":"41827922",
                    "nexo_transaction_id": ""
                  }
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Ok
 *         examples:
 *           application/json:
 *             {
 *                 "data": true
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

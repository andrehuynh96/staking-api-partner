const express = require('express');
const parseUser = require('app/middleware/parse-user.middleware');
const controller = require('./nexo-transaction.controller');
const router = express.Router();

router.get(
  '/transactions/:id/:device_code',
  parseUser,
  controller.getTxById
)

router.get(
  '/transactions/:device_code',
  parseUser,
  controller.getTxs
)

module.exports = router;
/**********************************************************************/

/**
 * @swagger
 * /api/v1/bank/nexo/transactions/{id}/{device_code}:
 *   get:
 *     summary: get nexo transaction by id
 *     tags:
 *       - Bank
 *     description:
 *     parameters:
 *       - in: path
 *         name: id
 *         type: string
 *         required: true
 *       - in: path
 *         name: device_code
 *         type: string
 *         required: true
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
 * /api/v1/bank/nexo/transactions/{device_code}:
 *   get:
 *     summary: get nexo transaction by current log in user
 *     tags:
 *       - Bank
 *     description:
 *     parameters:
 *       - in: path
 *         name: device_code
 *         type: string
 *         required: true
 *       - in: query
 *         name: offset
 *         type: integer
 *         format: int32
 *       - in: query
 *         name: limit
 *         type: integer
 *         format: int32
 *       - in: query
 *         name: sort_field
 *         type: string
 *       - in: query
 *         name: sort_by
 *         type: string
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Ok
 *         examples:
 *           application/json:
 *             {
 *              "data": {
 *                "items": [
 *                  {
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
                        "device_code": "device_code",
                        "created_at": "created_at",
                        "updated_at": "updated_at"
 *                  }
 *                 ],
 *                 "offset": 0,
 *                 "limit": 10,
 *                 "total": 1
 *               }
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
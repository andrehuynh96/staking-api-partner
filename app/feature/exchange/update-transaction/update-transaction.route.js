const express = require('express');
const controller = require('./update-transaction.controller');
const parseUser = require('app/middleware/parse-user.middleware');
const requestSchema = require('./update-transaction.request-schema');
const validator = require('app/middleware/validator.middleware');
const router = express.Router();

router.put(
  '/transactions/:id',
  parseUser,
  validator(requestSchema),
  controller
);

module.exports = router;


/*********************************************************************/


/**
 * @swagger
 * /api/v1/exchange/transactions/{id}:
 *   put:
 *     summary: update tx_id
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
 *       - name: id
 *         in: path
 *         type: string
 *       - in: body
 *         name: data
 *         description: Data.
 *         schema:
 *            type: object
 *            example:
 *               {
                      "tx_id": "0xd8de614b6cbf4acecaa47536fb34e90eb33bf39c2a440329ab9774d82f54422f",
                      "device_code": "4e90eb33bf39c2a440329ab9774dsfdsfds"
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


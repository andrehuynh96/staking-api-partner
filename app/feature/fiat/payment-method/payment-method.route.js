const express = require('express');
const parseUser = require('app/middleware/parse-user.middleware');
const controller = require('./payment-method.controller');

const router = express.Router();

router.get(
  '/payment-methods',
  parseUser,
  controller
);


module.exports = router;


/** *******************************************************************/


/**
 * @swagger
 * /api/v1/fiat/payment-methods:
 *   get:
 *     summary: get payment method
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
 *                     'debit-card','apple-pay'
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


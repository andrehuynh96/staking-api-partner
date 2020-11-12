const express = require('express');
const parseUser = require('app/middleware/parse-user.middleware');
const controller = require('./nexo-member.controller');
const validator = require('app/middleware/validator.middleware');
const { recovery_request, recovery_verify } = require('./validator');
const router = express.Router();

router.post(
  '/members/recovery/request',
  parseUser,
  validator(recovery_request),
  controller.recoveryRequest
);

router.post(
  '/members/recovery/verify',
  parseUser,
  validator(recovery_verify),
  controller.verifyRecovery
);

router.get(
  '/members/:device_code',
  parseUser,
  controller.getAccount
);

router.get(
  '/members/balance/:device_code',
  parseUser,
  controller.getBalance
)
module.exports = router;


/*********************************************************************/

/**
 * @swagger
 * /api/v1/bank/nexo/members/recovery/request:
 *   post:
 *     summary: recovery nexo account request
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
 *            - email
 *            example:
 *               {
 *                  "email": "jackpercy@olympios.com",
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


/**
 * @swagger
 * /api/v1/bank/nexo/members/recovery/verify:
 *   post:
 *     summary: verify nexo recovery account code
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
 *            - email
 *            - code
 *            example:
 *               {
 *                  "email": "jackpercy@olympios.com",
 *                   "code": "123456"
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

  /**
 * @swagger
 * /api/v1/bank/nexo/members/{device_code}:
 *   get:
 *     summary: get nexo account
 *     tags:
 *       - Bank
 *     description:
 *     parameters:
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
 *                "data": {
                        "id":"",
                        "email":"",
                        "first_name": "",
                        "last_name": "",
                        "nexo_id": "",
                        "created_at": "",
                        "updated_at": ""
                    }
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

 /**
 * @swagger
 * /api/v1/bank/nexo/members/balance/{device_code}:
 *   get:
 *     summary: get balance by current log in user nexo account
 *     tags:
 *       - Bank
 *     description:
 *     parameters:
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
 *              "data": {
 *                "items": [
 *                  {
                      'id': '',
                      'name': '',
                      'interest_rate': '',
                      'interest_earned': '',
                      'amount': '',
                      'min_earnable': '',
                      'deposit_enabled': '',
                      'withdraw_enabled': '' 
 *                  }
 *                 ]
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
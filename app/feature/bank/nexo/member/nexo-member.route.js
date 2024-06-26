const express = require('express');
const parseUser = require('app/middleware/parse-user.middleware');
const controller = require('./nexo-member.controller');
const validator = require('app/middleware/validator.middleware');
const { create, verify, recovery_request, recovery_verify, resend_active_code } = require('./validator');
const router = express.Router();


router.post(
  '/members',
  parseUser,
  validator(create),
  controller.create
);

router.post(
  '/members/resend-active-code',
  parseUser,
  validator(resend_active_code),
  controller.resendActiveCode
);


router.post(
  '/members/verify',
  parseUser,
  validator(verify),
  controller.verify
);

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
 * /api/v1/bank/nexo/members:
 *   post:
 *     summary: create nexo account
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
 *            - first_name
 *            - last_name
 *            example:
 *               {
                    "email":"",
                    "first_name": "",
                    "last_name": "",
                    "device_code": ""
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
                      "id":1,
                      "email":"",
                      "first_name": "",
                      "last_name": "",
                      "nexo_id": "5fa4bfedbcf58e63ce0d87b8",
                      "device_code": "",
                      "created_at": "",
                      "updated_at": ""
                  }
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
 * /api/v1/bank/nexo/members/resend-active-code:
 *   post:
 *     summary: resend active code
 *     tags:
 *       - Bank
 *     description: Time to resend is 30 minutes
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
 *                  "email": "thangdv@deliomart.com"
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
 * /api/v1/bank/nexo/members/verify:
 *   post:
 *     summary: verify nexo account
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
 *                  "email": "thangdv@deliomart.com",
                    "code":"41827922"
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
 *                  "code": "123456",
 *                  "device_code":"fsdf6dd_fd_3edc"
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
                     'id': 'CLMMS5XiGXTY',
                     'name': 'LINK',
                     'currency_id':'CRjXTWuXaOf8',
                     'interest_rate': 0,
                     'interest_earned': '0.00000000',
                     'amount': '0.00000000',
                     'min_earnable': '0.3',
                     'deposit_enabled': true,
                     'withdraw_enabled': true
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
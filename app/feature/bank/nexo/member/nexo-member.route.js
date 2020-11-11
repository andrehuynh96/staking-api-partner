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
)

router.post(
  '/members/recovery/verify',
  parseUser,
  validator(recovery_verify),
  controller.verifyRecovery
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
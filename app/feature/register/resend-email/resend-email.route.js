const config = require("app/config");
const express = require("express");
const validator = require("app/middleware/validator.middleware");
const schema = require("./resend-email.requet-schema");
const controller = require('./resend-email.controller');
const router = express.Router();

router.post(
  '/resend-email-verify',
  validator(schema),
  controller
);

module.exports = router;



/*********************************************************************/

/**
 * @swagger
 * /api/v1/accounts/resend-email-verify:
 *   post:
 *     summary: Resend Email Verify Register
 *     tags:
 *       - Accounts
 *     description: Resend Email Verify Register
 *     parameters:
 *       - in: body
 *         name: data
 *         description: Data for register.
 *         schema:
 *            type: object
 *            required:
 *            - email
 *            example:
 *               {
                        "email":"example@gmail.com"
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
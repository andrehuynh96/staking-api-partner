const express = require('express');
const controller = require('./check-email.controller');
const authenticate = require('app/middleware/authenticate.middleware');
const validator = require('app/middleware/validator.middleware');
const { checkEmailExist } = require('./validator');
const router = express.Router();

router.post(
  '/accounts/check',
  validator(checkEmailExist),
  authenticate,
  controller
);

module.exports = router;


/** *******************************************************************/

/**
 * @swagger
 * /api/v2/accounts/check:
 *   post:
 *     summary: check email exist
 *     tags:
 *       - Accounts
 *     description:
 *     parameters:
 *       - in: body
 *         name: data
 *         description: Data for
 *         schema:
 *            type: object
 *            example:
 *                {
 *                      "email":"luanpb@blockchainlabs.asia",
 *                  }
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Ok
 *         examples:
 *           application/json:
 *             {
 *                 "data":true
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
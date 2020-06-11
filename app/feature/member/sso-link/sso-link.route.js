const express = require('express');
const authenticate = require('app/middleware/authenticate.middleware');
const validator = require('app/middleware/validator.middleware');
const controller = require('./sso-link.controller');
const ssoLinkRequestSchema = require('./sso-link.request-schema');

const router = express.Router();

router.post(
  '/me/sso-link',
  validator(ssoLinkRequestSchema),
  controller
);

module.exports = router;

/** *******************************************************************/

/**
 * @swagger
 * /api/v1/accounts/me/sso-link:
 *   post:
 *     summary: Create a SSO link to login on Web wallet site
 *     tags:
 *       - Accounts
 *     description:
 *     parameters:
 *       - in: body
 *         name: data
 *         description: Data for refresh token.
 *         schema:
 *            type: object
 *            required:
 *            - refresh_token
 *            example:
 *               {
                        "refresh_token":"3f76680510bcca07e7e011dcc1effb079d1d0a34"
                  }
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Ok
 *         examples:
 *           application/json:
 *             {
 *                 "data":{
                      "ssoLink": "https://dev-staking-wallet-web.chainservices.info/sign-in?token=1c47fb13-dbc8-44ef-9ee7-7411e2539a2e"
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
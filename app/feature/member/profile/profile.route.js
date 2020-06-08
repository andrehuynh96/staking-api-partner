const express = require("express");
const controller = require('./profile.controller');
const authenticate = require('app/middleware/authenticate.middleware');
const router = express.Router();

router.get(
  '/me',
  authenticate,
  controller
);

module.exports = router;


/*********************************************************************/

/**
 * @swagger
 * /api/v1/accounts/me:
 *   get:
 *     summary: get proflie
 *     tags:
 *       - Accounts
 *     description:
 *     parameters:
 *       - name: authorization
 *         in: header
 *         required: true
 *         schema:
 *           type: string
 *           example:
 *             Bearer 123123123
 *     responses:
 *       200:
 *         description: Ok
 *         examples:
 *           application/json:
 *             {
 *                 "data": {
                        "id": "341e6439-b918-4b9a-89cb-c6325d01f79d",
                        "email": "thangdv@blockchainlabs.asia",
                        "phone": "",
                        "twofa_enable_flg": false,
                        "twofa_download_key_flg": true,
                        "member_sts": "ACTIVATED",
                        "referral_code": "45UPFGTW",
                        "referrer_code": "",
                        "latest_login_at": "2020-03-29T10:50:23.236Z",
                        "kyc_id": "0",
                        "kyc_level": 1,
                        "kyc_status": "Approved"
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


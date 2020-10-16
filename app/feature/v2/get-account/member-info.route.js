const express = require('express');
const controller = require('./member-info.controller');
const authenticate = require('app/middleware/authenticate.middleware');
const router = express.Router();

router.get(
  '/accounts/member-info',
  authenticate,
  controller
);

module.exports = router;


/*********************************************************************/
/**
 * @swagger
 * /api/v2/accounts/member-info:
 *   get:
 *     summary: Get member information
 *     tags:
 *       - 3RD Integrate
 *     description:
 *     parameters:
 *       - name: authorization
 *         in: header
 *         schema:
 *           type: string
 *           example:
 *             Bearer access_token
 *       - in: query
 *         name: email
 *         description: email of user
 *         format: string
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Ok
 *         examples:
 *           application/json:
 *             {
 *                "data": {
                      "id": "2defeb1e-f499-4a58-9f3b-511ceac9b270",
                      "email": "dawn0017@mailinator.com",
                      "first_name": "Do Lam",
                      "last_name": "Binh Minh",
                      "referral_code": "Z7SHA0LXM",
                      "referrer_code": "K22P2S1KF",
                      "max_references": null,
                      "membership_type_id": "f345042c-8e60-4357-98bc-41ea1136ebd0",
                      "latest_membership_order_id": null,
                      "kyc_id": "3",
                      "kyc_level": "LEVEL_2",
                      "kyc_status": "Approved",
                      "created_at": "2020-10-14T04:21:56.323Z",
                      "updated_at": "2020-10-14T08:38:35.482Z",
                      "twofa_enable_flg": false
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
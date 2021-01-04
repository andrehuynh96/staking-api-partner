const config = require("app/config");
const express = require("express");
const validator = require("app/middleware/validator.middleware");
const schema = require("./register.request-schema");
const controller = require('./register.controller');
const router = express.Router();

router.post(
  '/register',
  validator(schema),
  controller
);

module.exports = router;



/*********************************************************************/

/**
 * @swagger
 * /api/v1/accounts/register:
 *   post:
 *     summary: Register
 *     tags:
 *       - Accounts
 *     description: Register Account
 *     parameters:
 *       - in: body
 *         name: data
 *         description: Data for register.
 *         schema:
 *            type: object
 *            required:
 *            - email
 *            - password
 *            - phone
 *            - language
 *            example:
 *               {
                        "email":"example@gmail.com",
                        "password":"abc123456",
                        "phone":"0902907856",
                        "referrer_code":"WDRF3F1C",
                        "language": "EN",
                        "country" : "EN"
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
                        "id": "ad84f5a2-497d-11ea-b77f-2e728ce88125",
                        "email":"example@gmail.com",
                        "twofa_enable_flg": true,
                        "create_at":"",
                        "member_sts":"ACTIVATED",
                        "fullname":"Client",
                        "phone": "0909038232",
                        "date_of_birth": "22/09/2000",
                        "address": "123 Rood B",
                        "city": "HCM",
                        "post_code": "700000",
                        "country": "VN",
                        "referral_code": "RDFCSD4C",
                        "referrer_code": "WDRF3F1C",
                        "infinito_id": "",
                        "first_name":"",
                        "last_name":"",
                        "kyc_id":"",
                        "kyc_level":"",
                        "kyc_status":"",
                        "domain_name":"",
                        "membership_type_id":"",
                        "current_language":""
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
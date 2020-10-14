const express = require('express');
const controller = require('./account.controller');
const authenticate = require('app/middleware/authenticate.middleware');

const router = express.Router();

router.put(
  '/accounts/:id',
  authenticate,
  controller.update
);

module.exports = router;



/** *******************************************************************/

/**
 * @swagger
 * /api/v2/accounts/{id}:
 *   put:
 *     summary: Update account
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
 *                      "fullname":"Pham Van A",
 *                      "first_name":"A",
 *                      "last_name": "Pham Van",
 *                      "phone":"0900000000",
 *                      "date_of_birth":"1999-07-22",
 *                      "address":"A",
 *                      "city":"HCM",
 *                      "post_code":"7000000",
 *                      "country":"VN",
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
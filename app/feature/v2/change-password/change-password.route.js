const express = require('express');
const controller = require('./change-password.controller');
const authenticate = require('app/middleware/authenticate.middleware');
const validator = require('app/middleware/validator.middleware');
const { changePassword } = require('./validator');

const router = express.Router();

router.patch(
  '/accounts/:id/change-password',
  validator(changePassword),
  authenticate,
  controller.changePassword
);

module.exports = router;



/** *******************************************************************/

/**
* @swagger
* /api/v2/accounts/{id}/change-password:
*   patch:
*     summary: change password
*     tags:
*       - 3RD Integrate
*     description:
*     parameters:
 *       - in: body
 *         name: data
 *         description: Data for change password
 *         schema:
 *            type: object
 *            example:
 *                {
 *                      "password":"abc!@#",
 *                 }
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
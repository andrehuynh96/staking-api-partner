const express = require('express');
const authenticate = require('app/middleware/authenticate.middleware');
const controller = require('./claim-point.controller');
const router = express.Router();

router.get(
  '/claim-points',
  authenticate,
  controller.getAll
);

module.exports = router;


/*********************************************************************/


/**
 * @swagger
 * /v1/claim-points:
 *   get:
 *     summary: history list
 *     tags:
 *       - Claim Point
 *     description:
 *     parameters:
 *       - name: offset
 *         in: query
 *         type: integer
 *         format: int32
 *       - name: limit
 *         in: query
 *         type: integer
 *         format: int32
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Ok
 *         examples:
 *           application/json:
 *             {
 *                 "data": {
                      "items": [
                        { 
                          "id": 1,
                          "currency_symbol": "MS_POINT",
                          "amount": 100,
                          "system_type": "MEMBERSHIP",
                          "status": "Claim",
                          "create_at": "2020-09-23 17:00",
                          "update_at": "2020-09-23 17:00"
                        }
                      ],
                      "offset": 0,
                      "limit": 10,
                      "total": 1
 *                 }
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

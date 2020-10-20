const express = require('express');
const authenticate = require('app/middleware/authenticate.middleware');
const controller = require('./claim-point.controller');
const router = express.Router();

router.get(
  '/claim-points',
  authenticate,
  controller.getAll
);

router.get(
  '/claim-points/setting',
  authenticate,
  controller.setting
)

module.exports = router;


/*********************************************************************/


/**
 * @swagger
 * /api/v1/claim-points:
 *   get:
 *     summary: history list
 *     tags:
 *       - Claim Point
 *     description:
 *     parameters:
 *       - name: authorization
 *         in: header
 *         required: true
 *         schema:
 *           type: string
 *           example:
 *             Bearer 123123123
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

/**
 * @swagger
 * /api/v1/claim-points/setting:
 *   get:
 *     summary: get setting
 *     tags:
 *       - Claim Point
 *     description:
 *     parameters:
 *       - name: authorization
 *         in: header
 *         required: true
 *         schema:
 *           type: string
 *           example:
 *             Bearer 123123123
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Ok
 *         examples:
 *           application/json:
 *             {
 *                 "data": {
                      "amount": 100,
                      "time": 86400
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

 /**
 * @swagger
 * /api/v1/claim-points:
 *   post:
 *     summary: create claim point
 *     tags:
 *       - Claim Point
 *     description:
 *     parameters:
 *       - in: body
 *         name: data
 *         description: Data for claim point.
 *         schema:
 *            type: object
 *            example:
 *               {
                        "currency_symbol":"MS_POINT",
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

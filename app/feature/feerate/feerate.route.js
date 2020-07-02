const express = require('express');
const controller = require('./feerate.controller');

const router = express.Router();

router.get(
  '/feerates',
  controller.getAll
);

router.get(
  '/feerates/:symbol',
  controller.get
);


module.exports = router;


/*********************************************************************/

/**
 * @swagger
 * /api/v1/feerates/{symbol}:
 *   get:
 *     summary: feerate
 *     tags:
 *       - Feerate
 *     description:
 *     parameters:
 *      - in: path
 *        name: symbol
 *        type: string
 *        required: true
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Ok
 *         examples:
 *           application/json:
 *             {
 *                 "data": {
                      
                          "id":"2",
                          "name":"Ethereum",
                          "symbol":"ETH",
                          "high": 0,
                          "lo": 0,
                          "medium": 0                       
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
 * /api/v1/feerates:
 *   get:
 *     summary: feerates list
 *     tags:
 *       - Feerate
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
 *       - name: search
 *         in: query
 *         type: string
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
                          "id":"2",
                          "name":"Ethereum",
                          "symbol":"ETH",
                          "high": 0,
                          "lo": 0,
                          "medium": 0
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


const express = require("express");
const controller = require("./tracking-voting.controller");
const requestSchema = require("./tracking-voting.request-schema");
const validator = require("app/middleware/validator.middleware");
const route = express.Router();

route.post("/voting",
  validator(requestSchema),
  controller.track
)

route.post("/voting/3rd",
  validator(requestSchema),
  controller.track3rd
)


/*********************************************************************/

/**
 * @swagger
 * /api/v1/voting:
 *   post:
 *     summary: tracking voting
 *     tags:
 *       - Voting
 *     description: Voting
 *     parameters:
 *       - in: body
 *         name: data
 *         description: Data for login.
 *         schema:
 *            type: object
 *            required: 
 *            example: 
 *               {
                        "tx_id":"3f76680510bcca07e7e011dcc1effb079d1d0a34",
                        "voter_address":"cosmos18vwj2myc5l7taspq2nrmscldq7gzuxlv9m586h",
                        "memo":"Infinito:ATOM",
                        "type":"DELEGATE|UNDELEGATE",
                        "amount":100
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

 /**
 * @swagger
 * /api/v1/voting/3rd:
 *   post:
 *     summary: tracking voting for 3rd party
 *     tags:
 *       - Voting
 *     description: Voting
 *     parameters:
 *       - in: body
 *         name: data
 *         description: Data for login.
 *         schema:
 *            type: object
 *            required: 
 *            example: 
 *               {
                        "tx_id":"3f76680510bcca07e7e011dcc1effb079d1d0a34",
                        "voter_address":"cosmos18vwj2myc5l7taspq2nrmscldq7gzuxlv9m586h",
                        "memo":"Infinito:ATOM",
                        "type":"DELEGATE|UNDELEGATE",
                        "amount":100
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

module.exports = route;  
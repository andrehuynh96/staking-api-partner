const express = require('express');
const controller = require('./authentication.controller');

const router = express.Router();

router.post(
  '/authentication/token',
  controller
);

module.exports = router;



/*********************************************************************/

/**
 * @swagger
 * /api/v2/authentication/token:
 *   post:
 *     summary: Get token
 *     tags:
 *       - 3RD Integrate
 *     description:
 *     parameters:
 *       - in: body
 *         name: data
 *         description: Data for
 *         schema:
 *            type: object
 *            example:
 *               {
                    "client_id":"872a4a9d-cabe-4524-a01d-c70f74884d2a",
                    "client_secret":"39yce55G7iyS2E5x5fKTKf1Oh1gpsvrm",
                    "grant_type":"client_credentials|password|passwordless|refresh_token",
                    "username":"huyht+223@blockchainlabs.asia",
                    "password":"abc123456",
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
                        "access_token":
                        "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJjbGllbnRfaWQiOiI1YjAxN2Y4ZS03MzE3LTQ5ZDMtYTEyOC02MTg3NTdmMTBiZGEiLCJ1c2VyX2lkIjoiMGIyNWQ3YjAtMjFlZC00NmFiLWI3OTEtMDk4NmQxOWNiZDA3IiwiaWF0IjoxNTY0MDM4MTYwLCJleHAiOjE1NjQwODEzNjAsImF1ZCI6Imh0dHBzOi8vd3d3LmluZmluaXRvLmlvLyIsImlzcyI6ImluZmluaXRvMSIsInN1YiI6ImluZm9AaW5maW5pdG8uaW8ifQ.IyGnNfdrfIRvqm4XinoSiyQN8p3WW5FOgxXtaFpl-zD_3i53-3sVDgact2DnJN5jcCoHxG0ywFFtmWKNAFsfXyqckFaX6B7OQNVfnx_oaIF3_ewN63O6RJUAWh0RiaMiQC-G-XSR5JlvBw1GkxUcd_L8h6mJcK4pi6JAk7rM5Y6iKURWXRJU3O2Vb8A6wXPkynlQSulhYF4wer_KK017UbG_0G2OshRnNQ0Qqx04p8bC7bv8940rACKlyFmsERx76DpHabASDqDgF5-nKKJV7FSF4d9fWC40HTs2zVWhCnfrYADbEphGgi1d0Rg6f5EnYnf-gaFS6UD2CM2FO_DkYA",
                        "token_type": "Bearer",
                        "expires_in": 3599,
                        "refresh_token": "712e3e04038dad366f734248960c56a90de395f5"
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
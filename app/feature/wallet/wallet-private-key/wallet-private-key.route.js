const express = require('express');
const validator = require('app/middleware/validator.middleware');
const authenticate = require('app/middleware/authenticate.middleware');
const { create} = require('./validator');
const controller = require('./wallet-private-key.controller');

const router = express.Router();

router.post(
  '/wallets/:wallet_id/keys',
  authenticate,
  validator(create),
  controller.create
);

router.delete(
  '/wallets/:wallet_id/keys/:id',
  authenticate,
  controller.delete
);

router.post(
  '/wallets/:wallet_id/keys/:id/private',
  authenticate,
  controller.getPrivKey
);

router.get(
  '/wallets/:wallet_id/keys',
  authenticate,
  controller.get
);

router.get(
  '/wallets/:wallet_id/keys/:id',
  authenticate,
  controller.getKey
);

module.exports = router;

/*********************************************************************/

/**
 * @swagger
 * /api/v1/wallets/{wallet_id}/keys:
 *   post:
 *     summary: add coins
 *     tags:
 *       - Wallets
 *     description:
 *     parameters:
 *       - name: authorization
 *         in: header
 *         required: true
 *         schema:
 *           type: string
 *           example:
 *             Bearer 123123123
 *       - in: path
 *         name: wallet_id
 *         type: string
 *         required: true
 *       - in: body
 *         name: data
 *         description: Data for wallet private key.
 *         schema:
 *            type: array
 *            required:
 *            - items
 *            example:
 *               { items: [    
                    { "encrypted_private_key": "",
                    "platform": "",
                    "address": "",
                    "hd_path": ""}]
                  }
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Ok
 *         examples:
 *           application/json:
 *             {
 *                 "data":[{
                        "id": "656b6f1c-1039-11ea-8d71-362b9e155667",     
                        "platform":"",
                        "address": "",
                        "hd_path": "",
                        "created_at":""
                    }]
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
 * /api/v1/wallets/{wallet_id}/keys/{id}:
 *   delete:
 *     summary: delete coin
 *     tags:
 *       - Wallets
 *     description:
 *     parameters:
 *       - name: authorization
 *         in: header
 *         required: true
 *         schema:
 *           type: string
 *           example:
 *             Bearer 123123123
 *       - in: path
 *         name: wallet_id
 *         type: string
 *         required: true
 *       - in: path
 *         name: id
 *         type: string
 *         required: true
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Ok
 *         examples:
 *           application/json:
 *             {
 *                 "data":{
                      "deleted": true
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

 /**
 * @swagger
 * /api/v1/wallets/{wallet_id}/keys/{id}/private:
 *   post:
 *     summary: get encrypted private key
 *     tags:
 *       - Wallets
 *     description:
 *     parameters:
 *       - name: authorization
 *         in: header
 *         required: true
 *         schema:
 *           type: string
 *           example:
 *             Bearer 123123123
 *       - in: path
 *         name: wallet_id
 *         type: string
 *         required: true
 *       - in: path
 *         name: id
 *         type: string
 *         required: true
 *       - in: body
 *         name: data
 *         description: Data for wallet.
 *         schema:
 *            type: object
 *            optional:
 *            - twofa_code
 *            example:
 *               {     
                    "twofa_code": "123456"
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
                        "encrypted_private_key": ""
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

 /**
 * @swagger
 * /api/v1/wallets/{wallet_id}/keys:
 *   get:
 *     summary: get coins of wallet
 *     tags:
 *       - Wallets
 *     description:
 *     parameters:
 *       - name: authorization
 *         in: header
 *         required: true
 *         schema:
 *           type: string
 *           example:
 *             Bearer 123123123
 *       - in: path
 *         name: wallet_id
 *         type: string
 *         required: true  
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
               "data": {
                 "items": [{
                      "id": 1,
                      "platform": "ATOM",
                      "address": "",
                      "hd_path": "",
                      "created_at": "2020-01-07 20:22:04.728+09"
                    }],
                    "offset": 0,
                    "limit": 10,
                    "total": 1
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

/**
 * @swagger
 * /api/v1/wallets/{wallet_id}/keys/{id}:
 *   get:
 *     summary: get key of coin
 *     tags:
 *       - Wallets
 *     description:
 *     parameters:
 *       - name: authorization
 *         in: header
 *         required: true
 *         schema:
 *           type: string
 *           example:
 *             Bearer 123123123
 *       - in: path
 *         name: wallet_id
 *         type: string
 *         required: true
 *       - in: path
 *         name: id
 *         type: string
 *         required: true  
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Ok
 *         examples:
 *           application/json:
 *             {  
               "data": {
                  "id": 1,
                  "platform": "ATOM",
                  "address": "",
                  "hd_path": "",
                  "created_at": "2020-01-07 20:22:04.728+09"
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
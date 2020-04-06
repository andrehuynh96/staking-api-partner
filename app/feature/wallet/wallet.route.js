const express = require('express');
const validator = require('app/middleware/validator.middleware');
const authenticate = require('app/middleware/authenticate.middleware');
const { create, update } = require('./validator');
const controller = require('./wallet.controller');

const router = express.Router();

router.get(
  '/wallets',
  authenticate,
  controller.getAll
);

router.post(
  '/wallets',
  authenticate,
  validator(create),
  controller.create
);

router.put(
  '/wallets/:id',
  authenticate,
  validator(update),
  controller.update
);

router.delete(
  '/wallets/:id',
  authenticate,
  controller.delete
);

router.get(
  '/wallets/:wallet_id/passphrase',
  authenticate,
  controller.getPassphrase
);

router.use(require('./wallet-private-key/wallet-private-key.route'));
router.use(require('./wallet-token/wallet-token.route'));

module.exports = router;

/*********************************************************************/

/**
 * @swagger
 * /api/v1/wallets:
 *   get:
 *     summary: get wallet
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
 *       - name: offset
 *         in: query
 *         type: integer
 *         format: int32
 *       - name: limit
 *         in: query
 *         type: integer
 *         format: int32
 *       - name: default_flg
 *         in: query
 *         type: boolean
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
                      "default_flg": false,
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
 * /api/v1/wallets:
 *   post:
 *     summary: create / import wallet
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
 *       - in: body
 *         name: data
 *         description: Data for wallet.
 *         schema:
 *            type: object
 *            required:
 *            - encrypted_passphrase
 *            example:
 *               {     
                    "encrypted_passphrase": "",
                    "name": "thangdv",
                    "default_flg": true
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
                        "id": "656b6f1c-1039-11ea-8d71-362b9e155667",
                        "name": "thangdv",     
                        "default_flg":true,
                        "created_at":""
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
 * /api/v1/wallets/{id}:
 *   put:
 *     summary: update wallet
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
 *         name: id
 *         type: string
 *         required: true
 *       - in: body
 *         name: data
 *         description: Data for wallet.
 *         schema:
 *            type: object
 *            example:
 *               {     
 *                  "name": "wallet",
                    "default_flg": true
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
                        "id": "656b6f1c-1039-11ea-8d71-362b9e155667",
                        "name": "wallet",     
                        "default_flg":true,
                        "created_at":""
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
 *   delete:
 *     summary: delete wallet
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
 * /api/v1/wallets/{wallet_id}/passphrase:
 *   get:
 *     summary: get encrypted passphrase
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
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Ok
 *         examples:
 *           application/json:
 *             {
 *                 "data":{
                        "encrypted_passphrase": ""
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


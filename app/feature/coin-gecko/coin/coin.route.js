const express = require('express');
const config = require('app/config');
const authenticate = require('app/middleware/authenticate.middleware');
const cache = require('app/middleware/cache.middleware');
const controller = require('./coin.controller');
const router = express.Router();

router.get('/prices',
    authenticate,
    cache(config.cacheDurationTime),
    controller.getPrice
);

/**
* @swagger
* /api/v1/coin-gecko/prices:
*   get:
*     summary: get coin prices
*     tags:
*       - Coin Gecko
*     description:
*     parameters:
*       - name: authorization
*         in: header
*         schema:
*           type: string
*           example:
*             Bearer access_token
*       - in: query
*         name: platform
*         type: string
*         required: true
*     responses:
*       200:
*         description: Ok
*         examples:
*           application/json:
*             {
                "data":
                    {
                        "price":5.15,
                        "usd_24h_change":5.0521196510214885
                    }
                }
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

router.get('/histories',
    authenticate,
    cache(config.cacheDurationTime),
    controller.getHistories
);

/**
* @swagger
* /api/v1/coin-gecko/histories:
*   get:
*     summary: get histories market range
*     tags:
*       - Coin Gecko
*     description:
*     parameters:
*       - name: authorization
*         in: header
*         schema:
*           type: string
*           example:
*             Bearer access_token
*       - in: query
*         name: platform
*         type: string
*         required: true
*       - in: query
*         name: date_type
*         type: string
*         required: true
*         description: minute | hour | day | week | month |year | all
*       - in: query
*         name: date_num
*         type: number
*         required: true
*         description:
*     responses:
*       200:
*         description: Ok
*         examples:
*           application/json:
*             {
                "data": {
                    "prices": [
                        [
                            1600333174946,
                            378.88608405908695
                        ],
                        [
                            1600333387672,
                            378.79051441995233
                        ],
                        [
                            1600333687747,
                            378.1992962854312
                        ],
                        [
                            1600334065468,
                            377.9722494658705
                        ],
                        [
                            1600334346669,
                            378.7690927505214
                        ]
                    ],
                    "market_caps": [
                        [
                            1600333174946,
                            42775626929.99047
                        ],
                        [
                            1600333387672,
                            42676659196.785934
                        ],
                        [
                            1600333687747,
                            42676659196.785934
                        ],
                        [
                            1600334065468,
                            42599301360.24883
                        ]
                    ],
                    "total_volumes": [
                        [
                            1600333174946,
                            14703151380.736696
                        ],
                        [
                            1600333387672,
                            12046141340.218792
                        ],
                        [
                            1600333687747,
                            14795954865.409754
                        ],
                        [
                            1600334065468,
                            14059801701.569057
                        ]
                    ]
                }
            }
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

router.get('/markets',
    authenticate,
    cache(config.cacheDurationTime),
    controller.getMarkets
);

/**
* @swagger
* /api/v1/coin-gecko/markets:
*   get:
*     summary: get coin prices
*     tags:
*       - Coin Gecko
*     description:
*     parameters:
*       - name: authorization
*         in: header
*         schema:
*           type: string
*           example:
*             Bearer access_token
*       - in: query
*         name: platform
*         type: string
*         required: true
*     responses:
*       200:
*         description: Ok
*         examples:
*           application/json:
*             {
                "data": [
                    {
                        "id": "cosmos",
                        "symbol": "atom",
                        "name": "Cosmos",
                        "image": "https://assets.coingecko.com/coins/images/1481/large/cosmos_hub.png?1555657960",
                        "current_price": 5.2,
                        "market_cap": 1241404064,
                        "market_cap_rank": 22,
                        "fully_diluted_valuation": null,
                        "total_volume": 273894506,
                        "high_24h": 5.59,
                        "low_24h": 4.99,
                        "price_change_24h": -0.26771986,
                        "price_change_percentage_24h": -4.89236,
                        "market_cap_change_24h": -63858187.21392417,
                        "market_cap_change_percentage_24h": -4.89236,
                        "circulating_supply": 238526146.88641,
                        "total_supply": null,
                        "max_supply": null,
                        "ath": 8.84,
                        "ath_change_percentage": -41.24688,
                        "ath_date": "2020-08-25T11:49:21.269Z",
                        "atl": 1.16,
                        "atl_change_percentage": 347.67122,
                        "atl_date": "2020-03-13T02:27:44.591Z",
                        "roi": {
                            "times": 51.04477915027155,
                            "currency": "usd",
                            "percentage": 5104.477915027155
                        },
                        "last_updated": "2020-10-02T03:51:05.452Z"
                    }
                ]
            }
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

module.exports = router;

const controller = require("./plan.controller");
const express = require("express");
const route = express.Router();

route.get("/erc20/plans",
  controller.getAllPlans
)

module.exports = route;

/*********************************************************************/

/**
 * @swagger
 * /api/v1/erc20/plans:
 *   get:
 *     summary: Get all plans
 *     tags:
 *       - erc20
 *     description: Get all plans of erc20 staking
 *     parameters:
 *       - in: query
 *         name: status
 *         type: string
 *         description: Status of plans, it is `all`, `active` or `deactive` (ommit is all).
 *       - in: query
 *         name: staking_platform_id
 *         description: Staking platform id.
 *         type: string
 *       - in: query
 *         name: include_deleted
 *         description: Get deleted record or not.
 *         type: boolean
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Ok 
 *         examples:
 *           application/json:
 *             {
 *                 "data": [
                    {
                        "id": "0e37df36-f698-11e6-8dd4-cb9ced3df976",
                        "staking_plan_code": "plan-001",
                        "duration": 10,
                        "duration_type": "YEAR",
                        "reward_per_year": "9.100",
                        "actived_flg": true,
                        "reward_in_diff_platform_flg": true,
                        "reward_platform": "BTC",
                        "reward_token_address": "btcAddres",
                        "staking_platform_id": "36b7f440-1a3b-11ea-978f-2e728ce88125",
                        "deleted_flg": false
                    },
                    {
                        "id": "0e37df36-f698-11e6-8dd4-cb9ced3df970",
                        "staking_plan_code": "plan-051",
                        "duration": 16,
                        "duration_type": "MONTH",
                        "reward_per_year": "5.300",
                        "actived_flg": true,
                        "reward_in_diff_platform_flg": true,
                        "reward_platform": "ETH",
                        "reward_token_address": "ETHAddres",
                        "staking_platform_id": "36b7f440-1a3b-11ea-978f-2e728ce88125",
                        "deleted_flg": true
                    }
                  ]
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

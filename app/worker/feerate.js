const Feerates = require('app/model/wallet').feerates;
const axios = require('axios')
module.exports = {
    start: async()=>{
        // get coin
        let coins = await Feerates.findAll({
            attributes: ["symbol"],
            raw: true,
        })
        // update each coin
        coins.forEach(async(element) => {
            switch(element.symbol){
                // shatosi per byte
                case 'BTC':
                    let response = await axios.get('https://bitcoinfees.earn.com/api/v1/fees/recommended')
                    let high = response.data.fastestFee
                    let medium = response.data.halfHourFee
                    let low = response.data.hourFee 
                    await Feerates.update({ 
                        high: high,
                        low: low,
                        medium: medium
                        }, {
                        where: {
                            symbol: element.symbol
                        }
                    });
                    break
                default:
            }
        });

        
    }
}
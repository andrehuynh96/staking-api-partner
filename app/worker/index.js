const cron = require("node-cron");
const worker = require('./feerate')

module.exports = {
    start: async () =>{
        cron.schedule("*/5 * * * *", async function() {
            await worker.start()
        });
    }
}

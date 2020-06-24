const cron = require("node-cron");
const worker = require('./feerate')

module.exports = {
    start: async () =>{
        cron.schedule("* * * * *", async function() {
            await worker.start()
        });
    }
}

const cron = require("node-cron");
const worker = require('feerate')

cron.schedule("* * * * *", async function() {
    await worker.start()
});
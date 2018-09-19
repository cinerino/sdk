const { main } = require('./processPlaceOrderByCreditCard');

setInterval(async () => {
    try {
        await main();
    } catch (error) {
        console.error(error);
    }
}, 60000);


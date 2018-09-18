const { main } = require('./processPlaceOrderByCreditCard');

setInterval(async () => {
    try {
        await main();
    } catch (error) {
        console.error(eror);
    }
}, 60000);


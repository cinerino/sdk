const { main } = require('./processPlaceOrderByAnonymousCreditCard');

setInterval(async () => {
    try {
        await main();
    } catch (error) {
        console.error(error);
    }
}, 2000);


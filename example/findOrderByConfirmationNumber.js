/**
 * 確認番号で注文検索
 */
const auth = require('./auth');
const client = require('../lib/index');

async function main() {
    const authClient = await auth.login();
    await authClient.refreshAccessToken();
    const loginTicket = authClient.verifyIdToken({});
    console.log('username is', loginTicket.getUsername());

    const orderService = new client.service.Order({
        endpoint: process.env.API_ENDPOINT,
        auth: authClient
    });
    const order = await orderService.findByConfirmationNumber({
        confirmationNumber: 2,
        customer: {
            telephone: '+819012345678'
        }
    });
    console.log('order found', order.orderDate, order.orderNumber);
}

main().then(() => {
    console.log('success!');
}).catch(console.error);

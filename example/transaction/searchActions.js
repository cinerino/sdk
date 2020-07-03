/**
 * 取引に対するアクション検索
 */
const auth = require('../authAsAdmin');
const client = require('../../lib/index');

async function main() {
    const authClient = await auth.login();
    await authClient.refreshAccessToken();
    const loginTicket = authClient.verifyIdToken({});
    console.log('username is', loginTicket.getUsername());

    const placeOrderService = new client.service.txn.PlaceOrder({
        endpoint: process.env.API_ENDPOINT,
        auth: authClient
    });
    const actions = await placeOrderService.searchActionsByTransactionId({
        id: '5b9d94377f9a13009861c80a',
        sort: { startDate: client.factory.sortType.Ascending }
    });
    console.log(actions);
}

main().then(() => {
    console.log('success!');
}).catch(console.error);

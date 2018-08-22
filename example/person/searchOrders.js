/**
 * マイオーダー検索
 */
const auth = require('../auth');
const client = require('../../lib/index');
const moment = require('moment');

async function main() {
    const authClient = await auth.login();
    await authClient.refreshAccessToken();
    const loginTicket = authClient.verifyIdToken({});
    console.log('username is', loginTicket.getUsername());

    const personService = new client.service.Person({
        endpoint: process.env.API_ENDPOINT,
        auth: authClient
    });
    const orders = await personService.searchOrders({
        personId: 'me',
        orderDateFrom: moment().add(-1, 'week').toDate(),
        orderDateThrough: moment().toDate()
    });
    console.log(orders);
    console.log(orders.length, 'orders found');
}

main().then(() => {
    console.log('success!');
}).catch(console.error);

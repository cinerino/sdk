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
    console.log('payload:', loginTicket.payload);

    const personService = new client.service.Person({
        endpoint: process.env.API_ENDPOINT,
        auth: authClient
    });
    const { data } = await personService.searchOrders({
        personId: 'me',
        orderDateFrom: moment().add(-1, 'month').toDate(),
        orderDateThrough: moment().toDate(),
        orderDate: {
            $gte: moment().add(-1, 'month').toDate(),
            $lte: moment().toDate(),
        },
        limit: 20,
        page: 1,
        sort: {
            orderDate: client.factory.sortType.Descending
        }
    });
    console.log(data.map((o) => o.orderDate).join('\n'));
    console.log(data.length, 'orders returned');
}

main().then(() => {
    console.log('success!');
}).catch(console.error);

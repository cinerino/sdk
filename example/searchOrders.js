/**
 * 注文検索
 */
const moment = require('moment');
const auth = require('./authAsAdmin');
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

    const { totalCount, data } = await orderService.search({
        limit: 10,
        page: 1,
        orderDateFrom: moment().add(-1, 'month').toDate(),
        orderDateThrough: moment().toDate(),
        // customer: {
        //     typeOf: client.factory.personType.Person,
        //     identifiers: [
        //         { name: 'SampleName', value: 'SampleValue' }
        //     ]
        // },
        paymentMethods: {

            typeOfs: [client.factory.paymentMethodType.Account],
            // paymentMethodIds: ['30118000911']
        }
    });
    console.log(totalCount, 'orders found');
    console.log(data.length, 'orders returned');
}

main().then(() => {
    console.log('success!');
}).catch(console.error);

/**
 * インボイス検索
 */
const moment = require('moment');
const auth = require('./authAsAdmin');
const client = require('../lib/index');

async function main() {
    const authClient = await auth.login();
    await authClient.refreshAccessToken();
    const loginTicket = authClient.verifyIdToken({});
    console.log('username is', loginTicket.getUsername());

    const invoiceService = new client.service.Invoice({
        endpoint: process.env.API_ENDPOINT,
        auth: authClient
    });

    const { totalCount, data } = await invoiceService.search({
        limit: 10,
        page: 1,
        sort: { createdAt: client.factory.sortType.Descending },
        createdFrom: moment().add(-1, 'month').toDate(),
        createdThrough: moment().toDate(),
        // confirmationNumbers: ['9'],
        customer: {
            // identifiers: [
            //     { name: 'SampleName', value: 'SampleValue' }
            // ],
            telephone: '5678$'
        },
    });
    console.log(data);
    console.log(totalCount, 'invoices found');
    console.log(data.length, 'invoices returned');
}

main().then(() => {
    console.log('success!');
}).catch(console.error);

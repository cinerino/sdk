/**
 * 注文取引検索
 */
const moment = require('moment');
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
    const { totalCount, data } = await placeOrderService.search({
        // limit: 10,
        // startFrom: moment().add(-1, 'week').toDate(),
        // startThrough: moment().toDate(),
        // ids: ['5b7a17bf3920b61e7c354a82'],
        // statuses: [client.factory.transactionStatusType.Confirmed],
        // agent: {
        //     ids: ['fb6a8b9d-cf90-4608-80ac-4ebc7b8ae7f3'],
        //     typeOf: client.factory.personType.Person,
        //     identifiers: [
        //         {
        //             name: 'SampleName',
        //             value: 'SampleValue'
        //         }
        //     ]
        // },
        // seller: {
        //     typeOf: client.factory.organizationType.MovieTheater,
        //     ids: ['59d20831e53ebc2b4e774466']
        // },
        // object: {
        //     customerContact: {
        //         familyName: 'cine',
        //         givenName: 'taro',
        //         email: 'hello',
        //         telephone: '1234'
        //     }
        // },
        // result: {
        //     order: { orderNumbers: ['MO118-180820-000003'] }
        // }

    });
    console.log(totalCount, 'transactions found');
    console.log(data.length, 'transactions returned');
}

main().then(() => {
    console.log('success!');
}).catch(console.error);

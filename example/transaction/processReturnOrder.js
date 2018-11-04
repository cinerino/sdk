/**
 * 注文返品プロセス
 */
const moment = require('moment');
const auth = require('../authAsAdmin');
const client = require('../../lib/index');

async function main() {
    const authClient = await auth.login();
    await authClient.refreshAccessToken();
    const loginTicket = authClient.verifyIdToken({});
    console.log('username is', loginTicket.getUsername());

    const returnOrderService = new client.service.txn.ReturnOrder({
        endpoint: process.env.API_ENDPOINT,
        auth: authClient
    });

    const transaction = await returnOrderService.start({
        expires: moment().add(30, 'minutes').toDate(),
        object: {
            order: { orderNumber: 'MO118-181104-000004' }
        }
    });
    console.log('transaction started', transaction.id);

    console.log('confirming transaction...');
    await returnOrderService.confirm(transaction);
    console.log('transaction confirmed');
}

main().then(() => {
    console.log('success!');
}).catch(console.error);

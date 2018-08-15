/**
 * 注文返品プロセス
 */
const moment = require('moment');
const auth = require('../auth');
const client = require('../../lib/index');

async function main() {
    const authClient = await auth.login();
    await authClient.refreshAccessToken();
    const loginTicket = authClient.verifyIdToken({});
    console.log('username is', loginTicket.getUsername());

    const returnOrderService = new client.service.transaction.ReturnOrder({
        endpoint: process.env.API_ENDPOINT,
        auth: authClient
    });

    const transaction = await returnOrderService.start({
        expires: moment().add(30, 'minutes').toDate(),
        transactionId: '5b73f94c8f9ec01bc0ff74b9'
    });
    console.log('transaction started', transaction.id);

    console.log('confirming transaction...');
    await returnOrderService.confirm({
        transactionId: transaction.id
    });
    console.log('transaction confirmed');
}

main().then(() => {
    console.log('success!');
}).catch(console.error);

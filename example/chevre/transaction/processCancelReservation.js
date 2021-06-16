/**
 * 予約キャンセル取引サンプル
 */
const moment = require('moment');
const client = require('../../../lib/');

const auth = new client.auth.ClientCredentials({
    domain: process.env.TEST_AUTHORIZE_SERVER_DOMAIN,
    clientId: process.env.TEST_CLIENT_ID,
    clientSecret: process.env.TEST_CLIENT_SECRET,
    scopes: []
});
const eventService = new client.chevre.service.Event({
    endpoint: process.env.TEST_API_ENDPOINT,
    auth: auth
});
const cancelReservationService = new client.chevre.service.assetTransaction.CancelReservation({
    endpoint: process.env.TEST_API_ENDPOINT,
    auth: auth
});

const project = { id: 'cinerino' };

async function main() {
    console.log('starting transaction...');
    const transaction = await cancelReservationService.start({
        project: project,
        typeOf: client.factory.transactionType.Reserve,
        agent: {
            typeOf: 'Person',
            name: 'agent name'
        },
        object: {
            // reservation: {
            //     id: 'CIN135916265720083-0'
            // },
            transaction: {
                id: '5d37abe55c9bd400122d0ad2'
            }
        },
        expires: moment().add(5, 'minutes').toDate()
    });
    console.log('transaction started', transaction.id);

    await wait(1000);

    // 確定
    const result = await cancelReservationService.confirm({
        id: transaction.id
    });
    console.log('transaction confirmed', result);
}

async function wait(waitInMilliseconds) {
    return new Promise((resolve) => setTimeout(resolve, waitInMilliseconds));
}

main().then(() => {
    console.log('main processed.');
}).catch((err) => {
    console.error(err);
});

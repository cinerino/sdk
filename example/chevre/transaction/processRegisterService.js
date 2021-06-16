/**
 * サービス登録取引サンプル
 */
const moment = require('moment');
const client = require('../../../lib/');

const auth = new client.auth.ClientCredentials({
    domain: process.env.TEST_AUTHORIZE_SERVER_DOMAIN,
    clientId: process.env.TEST_CLIENT_ID,
    clientSecret: process.env.TEST_CLIENT_SECRET,
    scopes: []
});

const registerService = new client.chevre.service.assetTransaction.RegisterService({
    endpoint: process.env.TEST_API_ENDPOINT,
    auth: auth
});

const project = { id: 'cinerino' };

const identifier = `CIN${(new Date()).valueOf()}`;
const accessCode = '123';

async function main() {
    console.log('starting transaction...identifier:', identifier);
    let transaction = await registerService.start({
        project: { id: project.id },
        typeOf: client.factory.transactionType.RegisterService,
        agent: {
            typeOf: 'Person',
            name: 'agent name'
        },
        object: [{
            id: '7k740xps6',
            itemOffered: {
                id: '5eaf98ecbcba1736247577b0',
                serviceOutput: {
                    identifier: identifier,
                    accessCode: accessCode,
                    name: 'プリペ'
                }
            }
        }],
        expires: moment().add(5, 'minutes').toDate()
    });
    console.log('transaction started', transaction.id);

    // 確定
    await registerService.confirm({
        id: transaction.id,
    });
    console.log('transaction confirmed');
}

async function wait(waitInMilliseconds) {
    return new Promise((resolve) => setTimeout(resolve, waitInMilliseconds));
}

main().then(() => {
    console.log('main processed.');
}).catch((err) => {
    console.error(err);
});

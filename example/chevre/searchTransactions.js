/**
 * 販売者検索サンプル
 */
const client = require('../../lib/');

async function main() {
    const authClient = new client.auth.ClientCredentials({
        domain: process.env.TEST_AUTHORIZE_SERVER_DOMAIN,
        clientId: process.env.TEST_CLIENT_ID,
        clientSecret: process.env.TEST_CLIENT_SECRET,
        scopes: []
    });

    const transactionService = new client.chevre.service.Transaction({
        endpoint: process.env.TEST_API_ENDPOINT,
        auth: authClient
    });

    const { data } = await transactionService.search({
        project: { ids: ['cinerino'] },
        typeOf: client.factory.transactionType.RegisterService,
        transactionNumber: { $eq: 'CIN864922685165506' }
    });
    console.log(data);
    console.log(data.length);
}

main().then(() => {
    console.log('main processed.');
}).catch((err) => {
    console.error(err);
});

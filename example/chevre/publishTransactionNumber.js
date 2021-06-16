const client = require('../../lib/');

async function main() {
    const authClient = new client.auth.ClientCredentials({
        domain: process.env.TEST_AUTHORIZE_SERVER_DOMAIN,
        clientId: process.env.TEST_CLIENT_ID,
        clientSecret: process.env.TEST_CLIENT_SECRET,
        scopes: []
    });
    const transactionNumberService = new client.service.TransactionNumber({
        endpoint: process.env.TEST_API_ENDPOINT,
        auth: authClient
    });

    const result = await transactionNumberService.publish({
        project: { id: 'cinerino' }
    });
    console.log(result);
}

main().then(() => {
    console.log('main processed.');
}).catch((err) => {
    console.error(err);
});

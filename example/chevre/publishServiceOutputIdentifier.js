const client = require('../../lib/');

const project = { id: 'cinerino' };

async function main() {
    const authClient = new client.auth.ClientCredentials({
        domain: process.env.TEST_AUTHORIZE_SERVER_DOMAIN,
        clientId: process.env.TEST_CLIENT_ID,
        clientSecret: process.env.TEST_CLIENT_SECRET,
        scopes: []
    });
    const outputService = new client.service.ServiceOutput({
        endpoint: process.env.TEST_API_ENDPOINT,
        auth: authClient
    });

    const result = await outputService.publishIdentifier([...Array(100)].map(() => {
        return { project };
    }));
    console.log(result);
    console.log(result.length, 'identifiers published');
}

main().then(() => {
    console.log('main processed.');
}).catch((err) => {
    console.error(err);
});

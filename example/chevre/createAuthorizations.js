const client = require('../../lib/');

const project = { id: 'cinerino' };

async function main() {
    const authClient = new client.auth.ClientCredentials({
        domain: process.env.TEST_AUTHORIZE_SERVER_DOMAIN,
        clientId: process.env.TEST_CLIENT_ID,
        clientSecret: process.env.TEST_CLIENT_SECRET,
        scopes: []
    });
    const authorizationService = new client.service.Authorization({
        endpoint: process.env.TEST_API_ENDPOINT,
        auth: authClient
    });

    const result = await authorizationService.create([
        {
            project: project,
            code: 'someCode',
            data: { typeOf: client.factory.order.OrderType.Order, orderNumber: 'someOrderNumber' },
            validFrom: new Date(),
            expiresInSeconds: 1
        },
        {
            project: project,
            code: 'someCode2',
            data: { typeOf: client.factory.order.OrderType.Order, orderNumber: 'someOrderNumber2' },
            validFrom: new Date(),
            expiresInSeconds: 1
        }
    ]);
    console.log(result);
}

main().then(() => {
    console.log('main processed.');
}).catch((err) => {
    console.error(err);
});

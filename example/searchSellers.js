/**
 * 販売者検索
 */
const auth = require('./authAsAdmin');
// const auth = require('./auth');
const client = require('../lib/index');

async function main() {
    const authClient = new client.auth.ClientCredentials({
        domain: process.env.TEST_AUTHORIZE_SERVER_DOMAIN,
        clientId: process.env.TEST_CLIENT_ID,
        clientSecret: process.env.TEST_CLIENT_SECRET,
        scopes: [],
        state: ''
    });
    await authClient.refreshAccessToken();
    console.log(authClient.credentials);

    // const authClient = await auth.login();
    // await authClient.refreshAccessToken();
    // const loginTicket = authClient.verifyIdToken({});
    // console.log('username is', loginTicket.getUsername());

    const sellerService = new client.service.Seller({
        endpoint: process.env.API_ENDPOINT,
        auth: authClient,
        project: { id: 'cinerino' }
    });

    const { totalCount, data } = await sellerService.search({
        limit: 10,
        page: 1
    });
    console.log(totalCount, 'sellers found', new Date());
    console.log(data.length, 'sellers returned');
}

main().then(() => {
    console.log('success!');
}).catch(console.error);

setInterval(
    () => {
        main().then(() => {
            console.log('success!');
        }).catch(console.error);
    },
    1000
);

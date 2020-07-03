/**
 * プロダクト検索
 */
const moment = require('moment');

const auth = require('./auth');
const client = require('../lib/index');

const projectId = 'cinerino';

const authClient = new client.auth.ClientCredentials({
    domain: process.env.TEST_AUTHORIZE_SERVER_DOMAIN,
    clientId: process.env.TEST_CLIENT_ID,
    clientSecret: process.env.TEST_CLIENT_SECRET,
    scopes: [],
    state: ''
});

async function main() {
    // const authClient = await auth.login();
    // await authClient.refreshAccessToken();
    // const loginTicket = authClient.verifyIdToken({});
    // console.log('username is', loginTicket.getUsername());

    const productService = new client.service.Product({
        endpoint: process.env.API_ENDPOINT,
        auth: authClient,
        project: { id: projectId }
    });

    const { data } = await productService.search({
        typeOf: { $eq: 'PaymentCard' }
    });
    console.log(data);
    console.log(data.length, 'products returned');
}

main().then(() => {
    console.log('success!');
}).catch(console.error);

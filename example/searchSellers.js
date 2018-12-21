/**
 * 販売者検索
 */
const auth = require('./auth');
const client = require('../lib/index');

async function main() {
    const authClient = await auth.login();
    await authClient.refreshAccessToken();
    const loginTicket = authClient.verifyIdToken({});
    console.log('username is', loginTicket.getUsername());

    const sellerService = new client.service.Seller({
        endpoint: process.env.API_ENDPOINT,
        auth: authClient
    });

    const { totalCount, data } = await sellerService.search({
        limit: 10,
        page: 1
    });
    console.log(data);
    console.log(totalCount, 'sellers found');
    console.log(data.length, 'sellers returned');
}

main().then(() => {
    console.log('success!');
}).catch(console.error);

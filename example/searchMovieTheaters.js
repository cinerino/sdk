/**
 * 劇場検索
 */
const auth = require('./auth');
const client = require('../lib/index');

async function main() {
    const authClient = await auth.login();
    await authClient.refreshAccessToken();
    const loginTicket = authClient.verifyIdToken({});
    console.log('username is', loginTicket.getUsername());

    const organizationService = new client.service.Organization({
        endpoint: process.env.API_ENDPOINT,
        auth: authClient
    });

    const { totalCount, data } = await organizationService.searchMovieTheaters({
        limit: 10,
        page: 1
    });
    console.log(totalCount, 'organizations found');
    console.log(data.length, 'organizations returned');
}

main().then(() => {
    console.log('success!');
}).catch(console.error);

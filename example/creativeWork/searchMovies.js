/**
 * 映画検索サンプル
 */
const auth = require('../auth');
const client = require('../../lib/');

async function main() {
    const authClient = new client.auth.ClientCredentials({
        domain: process.env.TEST_AUTHORIZE_SERVER_DOMAIN,
        clientId: process.env.TEST_CLIENT_ID,
        clientSecret: process.env.TEST_CLIENT_SECRET,
        scopes: [],
        state: ''
    });

    const creativeWorkService = new client.service.CreativeWork({
        endpoint: process.env.API_ENDPOINT,
        auth: authClient
    });

    console.log('searching...');
    const { totalCount, data } = await creativeWorkService.searchMovies({
        limit: 10,
        sort: {
            identifier: client.factory.sortType.Ascending
        }
    });
    console.log(data);
    console.log(totalCount, 'found');
    console.log(data.length, 'returned');
}

main().then(() => {
    console.log('main processed.');
}).catch((err) => {
    console.error(err);
});

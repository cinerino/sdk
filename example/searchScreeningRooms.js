/**
 * スクリーン検索
 */
const moment = require('moment');

const auth = require('./auth');
const client = require('../lib/index');

async function main() {
    const authClient = new client.auth.ClientCredentials({
        domain: process.env.TEST_AUTHORIZE_SERVER_DOMAIN,
        clientId: process.env.TEST_CLIENT_ID,
        clientSecret: process.env.TEST_CLIENT_SECRET,
        scopes: [],
        state: ''
    });

    const placeService = new client.service.Place({
        endpoint: process.env.API_ENDPOINT,
        auth: authClient,
        project: { id: 'cinerino' }
    });

    const { data } = await placeService.searchScreeningRooms({
        containedInPlace: {
            branchCode: { $eq: '001' }
        }
    });
    console.log(data);
    console.log(data.length, 'places returned');
}

main().then(() => {
    console.log('success!');
}).catch(console.error);

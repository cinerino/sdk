/**
 * 上映イベント検索
 */
const moment = require('moment');

const auth = require('./auth');
const client = require('../lib/index');

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

    const eventService = new client.service.Event({
        endpoint: process.env.API_ENDPOINT,
        auth: authClient,
        project: { id: 'cinerino' }
    });

    const identifiers = [...Array(200)].map((_, i) => {
        return i;
    });
    console.log(identifiers);
    const { totalCount, data } = await eventService.search({
        inSessionFrom: moment().toDate(),
        inSessionThrough: moment().add(1, 'day').toDate(),
        offers: {
            availableFrom: moment().toDate(),
            availableThrough: moment().add(1, 'day').toDate(),
        },
        workPerformed: {
            identifiers: identifiers
        }
        // limit: 50,
        // page: 1
    });
    console.log(totalCount, 'events found');
    console.log(data.length, 'events returned');
}

main().then(() => {
    console.log('success!');
}).catch(console.error);

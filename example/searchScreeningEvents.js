/**
 * 上映イベント検索
 */
const moment = require('moment');

const auth = require('./auth');
const client = require('../lib/index');

async function main() {
    const authClient = await auth.login();
    await authClient.refreshAccessToken();
    const loginTicket = authClient.verifyIdToken({});
    console.log('username is', loginTicket.getUsername());

    const eventService = new client.service.Event({
        endpoint: process.env.API_ENDPOINT,
        auth: authClient
    });

    const { totalCount, data } = await eventService.searchScreeningEvents({
        inSessionFrom: moment().toDate(),
        inSessionThrough: moment().add(1, 'day').toDate(),
        offers: {
            availableFrom: moment().toDate(),
            availableThrough: moment().add(1, 'day').toDate(),
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

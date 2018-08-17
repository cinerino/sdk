/**
 * 上映イベント検索
 */
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

    const event = await eventService.findScreeningEventById({
        eventId: '7i9929cjkwm8ebp'
    });
    console.log(event);
}

main().then(() => {
    console.log('success!');
}).catch(console.error);

/**
 * イベント更新
 */
const auth = require('./authAsAdmin');
const client = require('../lib/index');

const project = { id: 'cinerino' };

async function main() {
    const authClient = await auth.login();
    await authClient.refreshAccessToken();
    const loginTicket = authClient.verifyIdToken({});
    console.log('username is', loginTicket.getUsername());

    const eventService = new client.service.Event({
        endpoint: process.env.API_ENDPOINT,
        auth: authClient,
        project: project
    });

    await eventService.updatePartially({
        id: '200901001001010900',
        // 
        eventStatus: client.factory.chevre.eventStatusType.EventScheduled
    });
    console.log('updated');
}

main().then(() => {
    console.log('success!');
}).catch(console.error);

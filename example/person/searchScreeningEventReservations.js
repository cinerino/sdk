/**
 * 上映イベント予約検索
 */
const auth = require('../auth');
const client = require('../../lib/index');

async function main() {
    const authClient = await auth.login();
    await authClient.refreshAccessToken();
    const loginTicket = authClient.verifyIdToken({});
    console.log('username is', loginTicket.getUsername());

    const personService = new client.service.Person({
        endpoint: process.env.API_ENDPOINT,
        auth: authClient
    });

    const { totalCount, data } = await personService.searchScreeningEventReservations({
        personId: 'me'
    });
    console.log(totalCount, 'reservations found');
    console.log(data.length, 'reservations returned');
}

main().then(() => {
    console.log('success!');
}).catch(console.error);

/**
 * トークンで予約照会
 */
const auth = require('./auth');
const client = require('../lib/index');

async function main() {
    const authClient = await auth.login();
    await authClient.refreshAccessToken();
    const loginTicket = authClient.verifyIdToken({});
    console.log('username is', loginTicket.getUsername());

    const personService = new client.service.Person({
        endpoint: process.env.API_ENDPOINT,
        auth: authClient
    });
    const ownershipInfoService = new client.service.OwnershipInfo({
        endpoint: process.env.API_ENDPOINT,
        auth: authClient
    });
    const reservationService = new client.service.Reservation({
        endpoint: process.env.API_ENDPOINT,
        auth: authClient
    });
    const { code } = await personService.authorizeOwnershipInfo({
        personId: 'me',
        goodType: client.factory.chevre.reservationType.EventReservation,
        identifier: 'EventReservation-MO118-180819-000002-1'
    });
    console.log('code is', code);
    const { token } = await ownershipInfoService.getToken({ code });
    console.log('token is', token);
    const ownershipInfo = await reservationService.findScreeningEventReservationByToken({ token });
    console.log('ownershipInfo:', ownershipInfo);
}

main().then(() => {
    console.log('success!');
}).catch(console.error);

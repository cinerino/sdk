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
    const ownershipInfoService = new client.service.OwnershipInfo({
        endpoint: process.env.API_ENDPOINT,
        auth: authClient
    });
    const reservationService = new client.service.Reservation({
        endpoint: process.env.API_ENDPOINT,
        auth: authClient
    });

    const reservations = await personService.searchScreeningEventReservations({
        personId: 'me'
    });
    console.log(reservations);
    console.log(reservations.length, 'reservations found');
    let ownershipInfo = reservations[0];

    console.log('publishing code...');
    const { code } = await personService.authorizeOwnershipInfo({
        personId: 'me',
        identifier: ownershipInfo.identifier,
        goodType: ownershipInfo.typeOfGood.typeOf
    })
    console.log('code published', code);

    console.log('getting token...');
    const { token } = await ownershipInfoService.getToken({
        code: code
    })
    console.log('token created', token);

    console.log('checking token...');
    ownershipInfo = await reservationService.findScreeningEventReservationByToken({ token: token });
    console.log('token is valid');
}

main().then(() => {
    console.log('success!');
}).catch(console.error);

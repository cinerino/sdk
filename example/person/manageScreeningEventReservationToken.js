/**
 * 上映イベント予約検索
 */
const moment = require('moment');

const auth = require('../auth');
const client = require('../../lib/index');

async function main() {
    const authClient = await auth.login();
    await authClient.refreshAccessToken();
    const loginTicket = authClient.verifyIdToken({});
    console.log('username is', loginTicket.getUsername());

    const personOwnershipInfoService = new client.service.person.OwnershipInfo({
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

    const searchScreeningEventReservationsResult = await personOwnershipInfoService.search({
        personId: 'me',
        ownedFrom: moment().add(-20, 'days').toDate(),
        ownedThrough: moment().toDate(),
        sort: {
            ownedFrom: client.factory.sortType.Descending
        },
        typeOfGood: {
            typeOf: client.factory.chevre.reservationType.EventReservation
        }
    });
    console.log(searchScreeningEventReservationsResult.totalCount, 'reservations found');
    console.log(searchScreeningEventReservationsResult.data.length, 'reservations returned');
    const reservationOwnershipInfo = searchScreeningEventReservationsResult.data[0];
    let reservation = reservationOwnershipInfo.typeOfGood;

    console.log('publishing code...');
    const { code } = await personOwnershipInfoService.authorize({
        personId: 'me',
        ownershipInfoId: reservationOwnershipInfo.id
    })
    console.log('code published', code);

    console.log('getting token...');
    const { token } = await ownershipInfoService.getToken({
        code: code
    })
    console.log('token created', token);

    console.log('checking token...');
    reservation = await reservationService.findScreeningEventReservationByToken({ token: token });
    console.log('token is valid');
}

main().then(() => {
    console.log('success!');
}).catch(console.error);

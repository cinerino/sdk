/**
 * 上映イベント予約検索
 */
const auth = require('./authAsAdmin');
const client = require('../lib/index');

async function main() {
    const authClient = await auth.login();
    await authClient.refreshAccessToken();
    const loginTicket = authClient.verifyIdToken({});
    console.log('username is', loginTicket.getUsername());

    const reservationService = new client.service.Reservation({
        endpoint: process.env.API_ENDPOINT,
        auth: authClient
    });
    const { totalCount, data } = await reservationService.search({
        limit: 1,
        page: 1,
        sort: { reservationNumber: client.factory.chevre.sortType.Ascending },
        reservationStatuses: [
            client.factory.chevre.reservationStatusType.ReservationConfirmed,
            client.factory.chevre.reservationStatusType.ReservationCancelled,
            client.factory.chevre.reservationStatusType.ReservationHold,
            client.factory.chevre.reservationStatusType.ReservationPending
        ],
        reservationFor: {
            typeOf: client.factory.chevre.eventType.ScreeningEvent,
            id: 'xdfl9ckjmjr61dw'
        }
    });
    console.log(totalCount, 'reservations found');
    console.log(data.length, 'reservations returned');
}

main().then(() => {
    console.log('success!');
}).catch(console.error);

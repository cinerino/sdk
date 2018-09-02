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

    const { totalCount, data } = await personOwnershipInfoService.search({
        personId: 'me',
        limit: 10,
        page: 1,
        ownedFrom: moment().add(-8, 'days').toDate(),
        ownedThrough: moment().toDate(),
        sort: {
            ownedFrom: client.factory.sortType.Descending
        },
        typeOfGood: {
            typeOf: client.factory.chevre.reservationType.EventReservation
        }
    });
    console.log(totalCount, 'reservations found');
    console.log(data.length, 'reservations returned');
}

main().then(() => {
    console.log('success!');
}).catch(console.error);

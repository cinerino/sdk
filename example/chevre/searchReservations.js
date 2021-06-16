/**
 * 予約検索サンプル
 */
const client = require('../../lib/');

async function main() {
    const authClient = new client.auth.ClientCredentials({
        domain: process.env.TEST_AUTHORIZE_SERVER_DOMAIN,
        clientId: process.env.TEST_CLIENT_ID,
        clientSecret: process.env.TEST_CLIENT_SECRET,
        scopes: []
    });

    const reservationService = new client.chevre.service.Reservation({
        endpoint: process.env.TEST_API_ENDPOINT,
        auth: authClient,
        project: { id: 'cinerino' }
    });

    const { data } = await reservationService.search({
        project: { id: { $eq: 'cinerino' } },
        typeOf: client.factory.reservationType.EventReservation,
        $projection: { underName: 1 }
    });
    console.log(data);
    console.log(data.length);
}

main().then(() => {
    console.log('main processed.');
}).catch((err) => {
    console.error(err);
});

/**
 * ムビチケ検索
 */
const moment = require('moment');
const auth = require('../authAsAdmin');
const client = require('../../lib/index');

async function main() {
    const authClient = await auth.login();
    await authClient.refreshAccessToken();
    const loginTicket = authClient.verifyIdToken({});
    console.log('username is', loginTicket.getUsername());

    const paymentMethodService = new client.service.PaymentMethod({
        endpoint: process.env.API_ENDPOINT,
        auth: authClient
    });

    const { totalCount, data } = await paymentMethodService.searchMovieTickets({
        limit: 10,
        page: 1,
        identifiers: ['8559919013'],
        // serviceTypes: ['01']
    });
    console.log(totalCount, 'paymentMethods found');
    console.log(data.length, 'paymentMethods returned');
}

main().then(() => {
    console.log('success!');
}).catch(console.error);

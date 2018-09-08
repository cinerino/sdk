/**
 * 確認番号で注文検索
 */
const auth = require('./auth');
const authAsAdmin = require('./authAsAdmin');
const client = require('../lib/index');

async function main() {
    const authClient = await auth.login();
    await authClient.refreshAccessToken();
    const loginTicket = authClient.verifyIdToken({});
    console.log('username is', loginTicket.getUsername());

    const orderService = new client.service.Order({
        endpoint: process.env.API_ENDPOINT,
        auth: authClient
    });
    const order = await orderService.authorizeOwnershipInfos({
        orderNumber: 'MO118-180904-000002',
        customer: {
            telephone: '+819012345678'
        }
    });
    console.log('order found', order.acceptedOffers[0].itemOffered.reservedTicket);

    const adminAuthClient = await authAsAdmin.login();
    const ownershipInfoService = new client.service.OwnershipInfo({
        endpoint: process.env.API_ENDPOINT,
        auth: adminAuthClient
    });
    const reservationService = new client.service.Reservation({
        endpoint: process.env.API_ENDPOINT,
        auth: adminAuthClient
    });
    console.log('getting token...');
    const { token } = await ownershipInfoService.getToken({
        code: order.acceptedOffers[0].itemOffered.reservedTicket.ticketToken
    })
    console.log('token created', token);

    console.log('checking token...');
    const reservationOwnershipInfo = await reservationService.findScreeningEventReservationByToken({ token: token });
    console.log('token is valid');

    console.log('searching check token actions...');
    const checkTokenActions = await ownershipInfoService.searchCheckTokenActions({ id: reservationOwnershipInfo.id });
    console.log(checkTokenActions.length, 'checkTokenActions found');
}

main().then(() => {
    console.log('success!');
}).catch(console.error);

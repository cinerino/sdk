const auth = require('./authAsAdmin');
const client = require('../lib/index');

const project = { id: 'cinerino' };

async function main() {
    const authClient = await auth.login();
    await authClient.refreshAccessToken();
    const loginTicket = authClient.verifyIdToken({});
    console.log('username is', loginTicket.getUsername());

    const reservationService = new client.service.Reservation({
        endpoint: process.env.API_ENDPOINT,
        auth: authClient,
        project: project
    });
    await reservationService.cancel({
        project: project,
        typeOf: client.factory.chevre.transactionType.CancelReservation,
        agent: { typeOf: 'Person', name: 'sample' },
        object: {
            reservation: { id: 'CIN029375202258362-0' }
        },
        expires: new Date(),
        potentialActions: {}
    });
    console.log('canceled');
}

main().then(() => {
    console.log('success!');
}).catch(console.error);

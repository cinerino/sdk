/**
 * 上映イベント予約検索
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

    const ownershipInfo = await personService.openAccount({
        personId: 'me',
        name: loginTicket.getUsername(),
        accountType: client.factory.accountType.Coin
    });
    console.log('account opened', ownershipInfo.typeOfGood.accountNumber);
}

main().then(() => {
    console.log('success!');
}).catch(console.error);

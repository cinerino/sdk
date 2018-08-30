/**
 * マイオーダー検索
 */
const auth = require('../auth');
const client = require('../../lib/index');
const moment = require('moment');

async function main() {
    const authClient = await auth.login();
    await authClient.refreshAccessToken();
    const loginTicket = authClient.verifyIdToken({});
    console.log('username is', loginTicket.getUsername());

    const personService = new client.service.Person({
        endpoint: process.env.API_ENDPOINT,
        auth: authClient
    });
    let accountOwnershipInfos = await personService.searchAccounts({
        personId: 'me',
        accountType: client.factory.accountType.Coin
    });
    accountOwnershipInfos = accountOwnershipInfos.filter((o) => o.typeOfGood.status === client.factory.pecorino.accountStatusType.Opened);
    console.log(accountOwnershipInfos.length, 'accounts found');

    const account = accountOwnershipInfos[0].typeOfGood;
    const { totalCount, data } = await personService.searchAccountMoneyTransferActions({
        personId: 'me',
        accountType: client.factory.accountType.Coin,
        accountNumber: account.accountNumber
    });
    console.log(totalCount, 'transferActions found');
    console.log(data.length, 'transferActions returned');
}

main().then(() => {
    console.log('success!');
}).catch(console.error);

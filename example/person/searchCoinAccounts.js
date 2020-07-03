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

    const personOwnershipInfoService = new client.service.person.OwnershipInfo({
        endpoint: process.env.API_ENDPOINT,
        auth: authClient
    });
    const ownershipInfoService = new client.service.OwnershipInfo({
        endpoint: process.env.API_ENDPOINT,
        auth: authClient
    });

    const searchAccountsResult = await personOwnershipInfoService.search({
        personId: 'me',
        typeOfGood: {
            typeOf: client.factory.ownershipInfo.AccountGoodType.Account,
            accountType: client.factory.accountType.Coin
        }
    });
    console.log(searchAccountsResult.totalCount, 'accounts found');
    console.log(searchAccountsResult.data.length, 'accounts returned');
    const accounts = searchAccountsResult.data.filter((o) => o.typeOfGood.status === client.factory.pecorino.accountStatusType.Opened);
    console.log(accounts.length, 'accounts opened');

    const accountOwnershipInfo = accounts[0];
    const account = accountOwnershipInfo.typeOfGood;
    const { totalCount, data } = await personOwnershipInfoService.searchAccountMoneyTransferActions({
        personId: 'me',
        limit: 10,
        page: 1,
        sort: {
            endDate: -1
        },
        accountType: account.accountType,
        accountNumber: account.accountNumber
    });
    console.log(totalCount, 'transferActions found');
    console.log(data.length, 'transferActions returned');

    console.log('publishing code...');
    const { code } = await personOwnershipInfoService.authorize({
        personId: 'me',
        ownershipInfoId: accountOwnershipInfo.id
    });
    console.log('code published', code);

    console.log('publishing token...');
    const { token } = await ownershipInfoService.getToken({ code });
    console.log('token published', token);
}

main().then(() => {
    console.log('success!');
}).catch(console.error);

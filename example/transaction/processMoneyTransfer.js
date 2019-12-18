/**
 * 通貨転送取引プロセス
 */
const moment = require('moment');
// const auth = require('../authAsAdmin');
const auth = require('../auth');
const client = require('../../lib/index');

async function main() {
    const authClient = await auth.login();
    await authClient.refreshAccessToken();
    const loginTicket = authClient.verifyIdToken({});
    console.log('username is', loginTicket.getUsername());

    const moneyTransferService = new client.service.txn.MoneyTransfer({
        endpoint: process.env.API_ENDPOINT,
        auth: authClient
    });

    const personOwnershipInfoService = new client.service.person.OwnershipInfo({
        endpoint: process.env.API_ENDPOINT,
        auth: authClient
    });

    const ownershipInfoService = new client.service.OwnershipInfo({
        endpoint: process.env.API_ENDPOINT,
        auth: authClient
    });

    const sellerService = new client.service.Seller({
        endpoint: process.env.API_ENDPOINT,
        auth: authClient
    });

    // 転送元に使用するコイン口座を決定する
    let accountOwnershipInfo;
    console.log('searching accounts...');
    const searchAccountsResult = await personOwnershipInfoService.search({
        typeOfGood: {
            typeOf: client.factory.ownershipInfo.AccountGoodType.Account,
            accountType: client.factory.accountType.Coin
        }
    });
    const accountOwnershipInfos = searchAccountsResult.data
        .filter((a) => a.typeOfGood.status === client.factory.pecorino.accountStatusType.Opened);
    if (accountOwnershipInfos.length === 0) {
        throw new Error('Opened account not found')
    } else {
        accountOwnershipInfo = accountOwnershipInfos[0];
    }
    console.log('your coin balance is', accountOwnershipInfo.typeOfGood.balance);

    const amount = 10;

    let fromLocation = accountOwnershipInfo.typeOfGood;
    const toLocation = {
        typeOf: client.factory.pecorino.account.TypeOf.Account,
        accountType: client.factory.accountType.Coin,
        accountNumber: '30118000911'
    };

    const agent = {
        typeOf: client.factory.personType.Person,
        id: 'agentId',
        name: 'agentName'
    };
    const recipient = {
        typeOf: client.factory.personType.Person,
        id: 'recipientId',
        name: 'recipientName'
    };

    // 取引を開始するにあたって、販売者の指定が必要
    const searchSellersResult = await sellerService.search({});
    const seller = searchSellersResult.data.shift();

    // 口座にコード発行
    const { code } = await personOwnershipInfoService.authorize({
        ownershipInfoId: accountOwnershipInfo.id
    });
    // 口座所有権をトークン化
    const { token } = await ownershipInfoService.getToken({ code });
    fromLocation = token;

    // トークンを使用して口座オーソリアクション
    console.log('starting transaction...');
    const transaction = await moneyTransferService.start({
        typeOf: client.factory.transactionType.MoneyTransfer,
        agent: agent,
        recipient: recipient,
        seller: { typeOf: seller.typeOf, id: seller.id },
        object: {
            amount: amount,
            fromLocation: fromLocation,
            toLocation: toLocation,
            description: `Money Transfer Transaction Sample ${moment().toISOString()}`,
            authorizeActions: []
        },
        expires: moment().add(1, 'minutes').toDate(),
    });
    console.log('transaction started', transaction.id);

    await wait(1000);

    console.log('confirming transaction...');
    await moneyTransferService.confirm(transaction);
    console.log('transaction confirmed');
}

async function wait(waitInMilliseconds) {
    return new Promise((resolve) => setTimeout(resolve, waitInMilliseconds));
}

main().then(() => {
    console.log('success!');
}).catch(console.error);

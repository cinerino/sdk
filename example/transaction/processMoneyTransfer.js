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

    const paymentService = new client.service.Payment({
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

    // 決済に使用するコイン口座を決定する
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
    const fromLocation = accountOwnershipInfo.typeOfGood;
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

    console.log('starting transaction...');
    const transaction = await moneyTransferService.start({
        typeOf: client.factory.transactionType.MoneyTransfer,
        agent: agent,
        recipient: recipient,
        object: {
            amount: amount,
            toLocation: toLocation,
            description: 'test from samples',
            authorizeActions: []
        },
        expires: moment().add(5, 'minutes').toDate(),
    });
    console.log('transaction started', transaction.id);

    // 口座にコード発行
    const { code } = await personOwnershipInfoService.authorize({
        ownershipInfoId: accountOwnershipInfo.id
    });
    // 口座所有権をトークン化
    const { token } = await ownershipInfoService.getToken({ code });

    // トークンを使用して口座オーソリアクション
    console.log('authorizing account payment...');
    let paymentAuth = await paymentService.authorizeAccount({
        object: {
            typeOf: client.factory.paymentMethodType.Account,
            amount: amount,
            fromAccount: token,
            toAccount: toLocation
        },
        purpose: transaction
    });
    console.log('account payment authorized', paymentAuth.id);

    await paymentService.voidTransaction({
        id: paymentAuth.id,
        object: {
            typeOf: client.factory.paymentMethodType.Account
        },
        purpose: transaction
    });
    console.log('payment transaction voided');

    console.log('authorizing account payment...');
    paymentAuth = await paymentService.authorizeAccount({
        object: {
            typeOf: client.factory.paymentMethodType.Account,
            amount: amount,
            fromAccount: token,
            toAccount: toLocation
        },
        purpose: transaction
    });
    console.log('account payment authorized', paymentAuth.id);

    // 購入者情報入力時間
    // tslint:disable-next-line:no-magic-numbers
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

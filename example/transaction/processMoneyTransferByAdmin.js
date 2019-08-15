/**
 * 通貨転送取引プロセス
 */
const moment = require('moment');
const auth = require('../authAsAdmin');
// const auth = require('../auth');
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

    const sellerService = new client.service.Seller({
        endpoint: process.env.API_ENDPOINT,
        auth: authClient
    });

    const amount = 10;

    const fromLocation = {
        typeOf: client.factory.pecorino.account.TypeOf.Account,
        accountType: client.factory.accountType.Coin,
        accountNumber: '30118000911'
    };
    // const fromLocation = {
    //     typeOf: 'Anonymous',
    //     name: 'anonymous location'
    // };

    const toLocation = {
        typeOf: client.factory.pecorino.account.TypeOf.Account,
        accountType: client.factory.accountType.Coin,
        accountNumber: '08100200091'
    };
    // const toLocation = {
    //     typeOf: 'Anonymous',
    //     name: 'Sample Anonymous To Location'
    // };

    const agent = {
        typeOf: client.factory.personType.Person,
        id: 'SampleAgentId',
        name: 'Sample Agent Name'
    };
    const recipient = {
        typeOf: client.factory.personType.Person,
        id: 'SampleRecipientId',
        name: 'Sample Recipient Name'
    };

    // いまのところ、取引を開始するにあたって、販売者の指定が必要
    const searchSellersResult = await sellerService.search({});
    const seller = searchSellersResult.data.shift();

    console.log('starting transaction with seller...', seller.name);
    const transaction = await moneyTransferService.start({
        typeOf: client.factory.transactionType.MoneyTransfer,
        agent: agent,
        recipient: recipient,
        seller: { typeOf: seller.typeOf, id: seller.id },
        object: {
            description: 'Money Transfer Transaction Sample ' + moment().toISOString(),
            authorizeActions: []
        },
        expires: moment().add(5, 'minutes').toDate(),
    });
    console.log('transaction started', transaction.id);

    // トークンを使用して口座オーソリアクション
    console.log('authorizing account payment...');
    let paymentAuth = await paymentService.authorizeAccount({
        object: {
            typeOf: client.factory.paymentMethodType.Account,
            amount: amount,
            fromAccount: (fromLocation.typeOf === client.factory.pecorino.account.TypeOf.Account) ? fromLocation : undefined,
            toAccount: (toLocation.typeOf === client.factory.pecorino.account.TypeOf.Account) ? toLocation : undefined
        },
        purpose: transaction
    });
    console.log('account payment authorized', paymentAuth.id);

    // await paymentService.voidTransaction({
    //     id: paymentAuth.id,
    //     object: {
    //         typeOf: client.factory.paymentMethodType.Account
    //     },
    //     purpose: transaction
    // });
    // console.log('payment transaction voided');

    // console.log('authorizing account payment...');
    // paymentAuth = await paymentService.authorizeAccount({
    //     object: {
    //         typeOf: client.factory.paymentMethodType.Account,
    //         amount: amount,
    //         fromAccount: token,
    //         toAccount: toLocation
    //     },
    //     purpose: transaction
    // });
    // console.log('account payment authorized', paymentAuth.id);

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

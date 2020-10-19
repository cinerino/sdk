/**
 * コイン口座決済による注文プロセス
 */
const moment = require('moment');
const auth = require('../auth');
const client = require('../../lib/index');

const accountType = 'Coin';

async function main() {
    const authClient = await auth.login();
    await authClient.refreshAccessToken();
    const loginTicket = authClient.verifyIdToken({});
    console.log('username is', loginTicket.getUsername());

    const sellerService = new client.service.Seller({
        endpoint: process.env.API_ENDPOINT,
        auth: authClient
    });
    const placeOrderService = new client.service.txn.PlaceOrder({
        endpoint: process.env.API_ENDPOINT,
        auth: authClient
    });
    const paymentService = new client.service.Payment({
        endpoint: process.env.API_ENDPOINT,
        auth: authClient
    });
    const personService = new client.service.Person({
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

    console.log('finding profile...');
    const profile = await personService.getProfile({});
    console.log('profile found');

    // 決済に使用するコイン口座を決定する
    let accountOwnershipInfo;
    console.log('searching accounts...');
    const searchAccountsResult = await personOwnershipInfoService.search({
        typeOfGood: {
            typeOf: client.factory.chevre.paymentMethodType.Account,
            accountType: accountType
        }
    });
    const accountOwnershipInfos = searchAccountsResult.data
        .filter((a) => a.typeOfGood.status === client.factory.pecorino.accountStatusType.Opened);
    if (accountOwnershipInfos.length === 0) {
        console.log('opening account...');
        await personOwnershipInfoService.openAccount({
            name: loginTicket.getUsername(),
            accountType: accountType
        });
        console.log('account opened');

        return;
    } else {
        accountOwnershipInfo = accountOwnershipInfos[0];
    }
    console.log('your coin balance is', accountOwnershipInfo.typeOfGood.balance);

    // 販売劇場検索
    const searchSellersResult = await sellerService.search({});
    const seller = searchSellersResult.data[Math.floor(searchSellersResult.data.length * Math.random())];
    if (seller === undefined) {
        throw new Error('No seller');
    }

    console.log('starting transaction...');
    const transaction = await placeOrderService.start({
        expires: moment().add(5, 'minutes').toDate(),
        seller: {
            typeOf: seller.typeOf,
            id: seller.id
        },
        object: {}
    });
    console.log('transaction started', transaction.id);

    // 口座にコード発行
    const { code } = await personOwnershipInfoService.authorize({
        ownershipInfoId: accountOwnershipInfo.id
    });
    console.log('code published', code);
    // 口座所有権をトークン化
    const { token } = await ownershipInfoService.getToken({ code });
    console.log('tokenized', token);

    // 金額計算
    let amount = 10;
    console.log('金額は', amount);

    // 口座オーソリアクション
    console.log('authorizing account payment...', token);
    const paymentAuth = await paymentService.authorizeAccount({
        object: {
            typeOf: client.factory.action.authorize.paymentMethod.any.ResultType.Payment,
            paymentMethod: client.factory.chevre.paymentMethodType.Account,
            amount: amount,
            // fromAccount: {
            //     accountType: accountType,
            //     accountNumber: accountOwnershipInfo.typeOfGood.accountNumber
            // }
            fromAccount: token
        },
        purpose: { typeOf: transaction.typeOf, id: transaction.id }
    });
    console.log('account payment authorized', paymentAuth.id);

    // 購入情報確認時間
    // tslint:disable-next-line:no-magic-numbers
    await wait(5000);

    // 取引を中止する場合はコチラ↓
    console.log('取引を中止します...');
    await placeOrderService.cancel({ id: transaction.id });
    console.log('取引を中止しました。');

    // console.log('confirming transaction...');
    // const result = await placeOrderService.confirm({
    //     id: transaction.id,
    //     sendEmailMessage: true
    // });
    // console.log('transaction confirmed', result.order.orderNumber);
}

async function wait(waitInMilliseconds) {
    return new Promise((resolve) => setTimeout(resolve, waitInMilliseconds));
}

main().then(() => {
    console.log('success!');
}).catch(console.error);

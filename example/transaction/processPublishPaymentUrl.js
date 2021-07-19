/**
 * 決済URL発行サンプル
 */
const moment = require('moment');
const client = require('../../lib/');

const project = { id: 'cinerino' };

const authClient = new client.auth.ClientCredentials({
    domain: process.env.TEST_AUTHORIZE_SERVER_DOMAIN,
    clientId: process.env.TEST_CLIENT_ID,
    clientSecret: process.env.TEST_CLIENT_SECRET,
    scopes: [],
    state: ''
});

const paymentService = new client.service.Payment({
    endpoint: process.env.API_ENDPOINT,
    auth: authClient,
    project
});

const placeOrderService = new client.service.txn.PlaceOrder({
    endpoint: process.env.API_ENDPOINT,
    auth: authClient,
    project
});

const sellerService = new client.service.Seller({
    endpoint: process.env.API_ENDPOINT,
    auth: authClient,
    project
});

async function main() {
    const searchSellersResult = await sellerService.search({});
    const seller = searchSellersResult.data[Math.floor(searchSellersResult.data.length * Math.random())];
    if (seller === undefined) {
        throw new Error('No seller');
    }
    console.log('ordering from seller...', seller.name.ja);

    console.log('starting transaction...');
    const transaction = await placeOrderService.start({
        expires: moment()
            .add(30, 'seconds')
            .toDate(),
        seller: { typeOf: seller.typeOf, id: seller.id },
        object: {
            // passport: { token: passportToken }
        }
    });
    console.log('transaction started', transaction.id);

    // const transactionNumber = `CIN${(new Date()).valueOf()}`;
    const paymentMethodType = 'PayPay';
    const amount = 10;

    // 外部決済URL発行
    console.log('starting transaction...transactionNumber:');
    let publishResult = await paymentService.publishCreditCardPaymentUrl({
        object: {
            typeOf: client.factory.action.authorize.paymentMethod.any.ResultType.Payment,
            paymentMethod: paymentMethodType,
            amount
        },
        purpose: { typeOf: transaction.typeOf, id: transaction.id },
    });
    console.log('publishResult:', publishResult);


    /////////////////////////////////////////////////
    /////////////////////////////////////////////////
    // publishResult.paymentUrlで決済してから先へ進む
    /////////////////////////////////////////////////
    /////////////////////////////////////////////////


    const creditCardPaymentAuth = await paymentService.authorizeCreditCard({
        object: {
            typeOf: client.factory.action.authorize.paymentMethod.any.ResultType.Payment,
            paymentMethod: paymentMethodType,
            paymentMethodId: publishResult.paymentMethodId, // 発行された決済IDを指定する
            amount,
            method: '1',
            creditCard: { token: 'xxx' }
        },
        purpose: { typeOf: transaction.typeOf, id: transaction.id },
    });
    console.log('credit card payment authorized', creditCardPaymentAuth);
}

main().then(() => {
    console.log('main processed.');
}).catch((err) => {
    console.error(err);
});

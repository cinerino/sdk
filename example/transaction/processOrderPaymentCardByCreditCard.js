/**
 * 決済カード注文
 */
const moment = require('moment');
const client = require('../../lib/index');

const projectId = 'cinerino';

const authClient = new client.auth.ClientCredentials({
    domain: process.env.TEST_AUTHORIZE_SERVER_DOMAIN,
    clientId: process.env.TEST_CLIENT_ID,
    clientSecret: process.env.TEST_CLIENT_SECRET,
    scopes: [],
    state: ''
});

const offerService = new client.service.Offer({
    endpoint: process.env.API_ENDPOINT,
    auth: authClient,
    project: { id: projectId }
});
const sellerService = new client.service.Seller({
    endpoint: process.env.API_ENDPOINT,
    auth: authClient,
    project: { id: projectId }
});
const placeOrderService = new client.service.txn.PlaceOrder({
    endpoint: process.env.API_ENDPOINT,
    auth: authClient,
    project: { id: projectId }
});
const paymentService = new client.service.Payment({
    endpoint: process.env.API_ENDPOINT,
    auth: authClient,
    project: { id: projectId }
});

const productService = new client.service.Product({
    endpoint: process.env.API_ENDPOINT,
    auth: authClient,
    project: { id: projectId }
});

async function main() {
    // 取引に使用するクレジットカード
    let creditCard = {
        cardNo: '4111111111111111',
        expire: '2412',
        holderName: 'AA BB'
    };

    // 入金口座
    const toLocation = {
        typeOf: client.factory.pecorino.account.TypeOf.Account,
        accountType: client.factory.accountType.Coin,
        accountNumber: '30118000911'
    };

    // プロダクト検索
    const { data } = await productService.search({
        typeOf: { $eq: 'PaymentCard' }
    });
    const product = data.shift();

    // 販売者検索
    const searchSellersResult = await sellerService.search({});
    const seller = searchSellersResult.data[Math.floor(searchSellersResult.data.length * Math.random())];
    if (seller === undefined) {
        throw new Error('No seller');
    }
    console.log('ordering from seller...', seller.name.ja);

    console.log('starting transaction...');
    const transaction = await placeOrderService.start({
        expires: moment().add(1, 'minutes').toDate(),
        agent: {},
        seller: {
            typeOf: seller.typeOf,
            id: seller.id
        },
        object: {
            // passport: { token: passportToken }
        }
    });
    console.log('transaction started', transaction.id);

    const accessCode = '123';

    let paymentCardAuthorization = await offerService.authorizePaymentCard({
        object: {
            typeOf: 'Offer',
            id: 'dummy',
            itemOffered: {
                typeOf: 'PaymentCard',
                id: product.id,
                serviceOutput: {
                    accessCode: accessCode,
                    name: 'サンプルプリペイドカード',
                    additionalProperty: []
                }
            }
        },
        purpose: { typeOf: transaction.typeOf, id: transaction.id }
    });
    console.log('paymentCard authorized. id:', paymentCardAuthorization.id);

    // クレジットカード決済承認
    // console.log('authorizing credit card payment...');
    // let creditCardPaymentAuth = await paymentService.authorizeCreditCard({
    //     object: {
    //         typeOf: client.factory.paymentMethodType.CreditCard,
    //         amount: amount,
    //         method: '1',
    //         creditCard: creditCard
    //     },
    //     purpose: { typeOf: transaction.typeOf, id: transaction.id },
    // });
    // console.log('credit card payment authorized', creditCardPaymentAuth.id);

    await wait(5000);

    console.log('setting customer profile...');
    const profile = {
        email: 'hello@motionpicture.jp',
        givenName: 'Taro',
        familyName: 'Motion',
        name: 'Taro ☆ Motion',
        telephone: '+819012345678',
    };
    await placeOrderService.setProfile({
        id: transaction.id,
        agent: profile
    });
    console.log('customer profile set');

    await wait(5000);

    console.log('confirming transaction...');
    const email = {
        sender: {
            name: `♥ ${seller.name.ja} ♥`
        },
        about: `♥♥♥ ${profile.name}さんへプリペイドカード発行のお知らせ ♥♥♥`
    };

    let result = await placeOrderService.confirm({
        id: transaction.id,
        potentialActions: {
            order: {
                potentialActions: {
                    sendOrder: {
                        potentialActions: {
                            sendEmailMessage: [
                                {
                                    object: email
                                }
                            ]
                        }
                    }
                }
            }
        }
    });
    console.log('transaction confirmed', result.order.orderNumber);
}

async function wait(waitInMilliseconds) {
    return new Promise((resolve) => setTimeout(resolve, waitInMilliseconds));
}

main().then(() => {
    console.log('success!');
}).catch(console.error);

exports.main = main;
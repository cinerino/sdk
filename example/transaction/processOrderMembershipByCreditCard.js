/**
 * メンバーシップ注文
 */
const moment = require('moment');
const auth = require('../auth');
const client = require('../../lib/index');

const projectId = 'cinerino';

// const authClient = new client.auth.ClientCredentials({
//     domain: process.env.TEST_AUTHORIZE_SERVER_DOMAIN,
//     clientId: process.env.TEST_CLIENT_ID,
//     clientSecret: process.env.TEST_CLIENT_SECRET,
//     scopes: [],
//     state: ''
// });

// 取引に使用するクレジットカード
const creditCard = {
    cardNo: '4111111111111111',
    expire: '2412',
    holderName: 'AA BB'
};

// ポイント特典付与口座
const pointAwardAccount = {
    accountNumber: '029387028110812'
    // accountNumber: '1604362599987'

}

// 購入者プロフィール
// const profile = {
//     email: '',
//     givenName: 'Taro',
//     familyName: 'Motion',
//     name: 'Taro ☆ Motion',
//     telephone: '+819012345678',
// };

async function main() {
    const authClient = await auth.login();
    await authClient.refreshAccessToken();
    const loginTicket = authClient.verifyIdToken({});
    console.log('username is', loginTicket.getUsername());

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

    const personService = new client.service.Person({
        endpoint: process.env.API_ENDPOINT,
        auth: authClient
    });

    console.log('finding profile...');
    const profile = await personService.getProfile({});
    console.log('profile found');

    // 販売者検索
    const searchSellersResult = await sellerService.search({});
    const seller = searchSellersResult.data[Math.floor(searchSellersResult.data.length * Math.random())];
    if (seller === undefined) {
        throw new Error('No seller');
    }
    console.log('ordering from seller...', seller.name.ja);

    // メンバーシップ検索
    const { data } = await productService.search({
        typeOf: { $eq: client.factory.chevre.product.ProductType.MembershipService }
    });
    const product = data.shift();
    console.log('ordering product...', product.name.ja);

    // オファー検索
    const availableOffers = await productService.searchOffers({
        itemOffered: { id: product.id },
        seller: { id: seller.id }
    });
    console.log(availableOffers.length, 'offers available');
    const acceptedOffer = availableOffers[0];
    console.log('offer selected', acceptedOffer.name.ja, acceptedOffer.priceSpecification.priceComponent[0].price);

    console.log('starting transaction...');
    const transaction = await placeOrderService.start({
        expires: moment()
            .add(30, 'seconds')
            .toDate(),
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

    // 適当に電話番号下4桁
    const accessCode = profile.telephone.slice(-4);

    let productOfferAuthorization = await offerService.authorizeProduct({
        object: {
            typeOf: acceptedOffer.typeOf,
            id: acceptedOffer.id,
            itemOffered: {
                typeOf: product.typeOf,
                id: product.id,
                serviceOutput: {
                    accessCode: accessCode,
                    name: product.name.ja
                    // additionalProperty: [{ name: 'sampleName', value: 'sampleValue' }]
                },
                // ポイント特典付与先を指定
                pointAward: {
                    typeOf: client.factory.chevre.actionType.MoneyTransfer,
                    toLocation: { identifier: pointAwardAccount.accountNumber },
                    ...{
                        recipient: {
                            id: transaction.agent.id,
                            name: `${profile.givenName} ${profile.familyName}`,
                            typeOf: transaction.agent.typeOf
                        }
                    }
                }
            }
        },
        purpose: { typeOf: transaction.typeOf, id: transaction.id }
    });
    console.log('product offer authorized. id:', productOfferAuthorization.id);

    // クレジットカード決済承認
    console.log('authorizing credit card payment...');
    let creditCardPaymentAuth = await paymentService.authorizeCreditCard({
        object: {
            typeOf: client.factory.action.authorize.paymentMethod.any.ResultType.Payment,
            paymentMethod: client.factory.paymentMethodType.CreditCard,
            amount: acceptedOffer.priceSpecification.priceComponent[0].price,
            method: '1',
            creditCard: creditCard
        },
        purpose: { typeOf: transaction.typeOf, id: transaction.id },
    });
    console.log('credit card payment authorized', creditCardPaymentAuth.id);

    await wait(5000);

    console.log('setting customer profile...');
    await placeOrderService.setProfile({
        id: transaction.id,
        agent: {
            email: profile.email,
            givenName: profile.givenName,
            familyName: profile.familyName,
            telephone: profile.telephone,
        }
    });
    console.log('customer profile set');

    await wait(5000);

    console.log('confirming transaction...');
    const email = {
        sender: {
            name: `♥ ${seller.name.ja} ♥`
        },
        about: `♥♥♥ ${profile.name}さんへメンバーシップ発行のお知らせ ♥♥♥`
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
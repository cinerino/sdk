/**
 * 決済URL発行サンプル
 */
const moment = require('moment');
const client = require('../../../lib/');

const project = { id: 'cinerino' };

const auth = new client.auth.ClientCredentials({
    domain: process.env.CHEVRE_AUTHORIZE_SERVER_DOMAIN,
    clientId: process.env.CHEVRE_CLIENT_ID,
    clientSecret: process.env.CHEVRE_CLIENT_SECRET,
    scopes: []
});

const payService = new client.chevre.service.assetTransaction.Pay({
    endpoint: process.env.CHEVRE_ENDPOINT,
    auth: auth,
    project
});

const sellerService = new client.chevre.service.Seller({
    endpoint: process.env.CHEVRE_ENDPOINT,
    auth: auth,
    project
});

async function main() {
    const searchSellersResult = await sellerService.search({ project: { id: { $eq: project.id } }, limit: 1 });
    const seller = searchSellersResult.data[0];

    const transactionNumber = `CIN${(new Date()).valueOf()}`;
    const paymentMethodType = 'PayPay';

    console.log('starting transaction...transactionNumber:', transactionNumber);
    let publishResult = await payService.publishPaymentUrl({
        project: { id: project.id },
        typeOf: client.factory.transactionType.Pay,
        transactionNumber: transactionNumber,
        agent: { typeOf: 'Person', name: 'サンプル決済者名称' },
        recipient: { typeOf: seller.typeOf, name: seller.name, id: seller.id },
        object: {
            typeOf: client.factory.service.paymentService.PaymentServiceType.CreditCard,
            paymentMethod: {
                typeOf: paymentMethodType,
                amount: 10,
                // additionalProperty: [{ name: 'sampleName', value: 'sampleValue' }],
                // method: '1',
                creditCard: {
                    // token: 'token',
                    // cardNo: '4111111111111111',
                    // expire: '2411',
                    // holderName: 'A B'
                },
                // name: 'クレカ'
            }
        },
        // expires: moment()
        //     .add(5, 'minutes')
        //     .toDate()
    });
    console.log('publishResult:', publishResult);
}

main().then(() => {
    console.log('main processed.');
}).catch((err) => {
    console.error(err);
});

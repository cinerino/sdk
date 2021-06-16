/**
 * 返金取引サンプル
 */
const moment = require('moment');
const client = require('../../../lib/');

const auth = new client.auth.ClientCredentials({
    domain: process.env.TEST_AUTHORIZE_SERVER_DOMAIN,
    clientId: process.env.TEST_CLIENT_ID,
    clientSecret: process.env.TEST_CLIENT_SECRET,
    scopes: []
});

const refundService = new client.chevre.service.assetTransaction.Refund({
    endpoint: process.env.TEST_API_ENDPOINT,
    auth: auth
});

const sellerService = new client.chevre.service.Seller({
    endpoint: process.env.TEST_API_ENDPOINT,
    auth: auth
});

const project = { id: 'cinerino' };

async function main() {

    const searchSellersResult = await sellerService.search({ project: { id: { $eq: project.id } }, limit: 1 });
    const seller = searchSellersResult.data[0];

    const transactionNumber = `CIN${(new Date()).valueOf()}`;
    const paymentMethodType = 'CreditCard';

    console.log('starting transaction...transactionNumber:', transactionNumber);
    let transaction = await refundService.start({
        project: { id: project.id },
        typeOf: client.factory.transactionType.Refund,
        transactionNumber: transactionNumber,
        agent: { typeOf: seller.typeOf, name: seller.name, id: seller.id },
        recipient: { typeOf: 'Person', name: 'サンプル決済者名称' },
        object: {
            typeOf: client.factory.service.paymentService.PaymentServiceType.CreditCard,
            paymentMethod: {
                typeOf: paymentMethodType,
                paymentMethodId: 'CIN438268608702343'
            }
        },
        expires: moment()
            .add(5, 'minutes')
            .toDate()
    });
    console.log('transaction started', transaction);

    // 確定
    await refundService.confirm({
        transactionNumber: transactionNumber
    });
    console.log('transaction confirmed');
}

async function wait(waitInMilliseconds) {
    return new Promise((resolve) => setTimeout(resolve, waitInMilliseconds));
}

main().then(() => {
    console.log('main processed.');
}).catch((err) => {
    console.error(err);
});

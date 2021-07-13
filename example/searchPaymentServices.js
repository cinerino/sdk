/**
 * 決済サービス検索
 */
const moment = require('moment');

const auth = require('./auth');
const client = require('../lib/index');

const projectId = 'cinerino';

const authClient = new client.auth.ClientCredentials({
    domain: process.env.TEST_AUTHORIZE_SERVER_DOMAIN,
    clientId: process.env.TEST_CLIENT_ID,
    clientSecret: process.env.TEST_CLIENT_SECRET,
    scopes: [],
    state: ''
});

async function main() {
    // const authClient = await auth.login();
    // await authClient.refreshAccessToken();
    // const loginTicket = authClient.verifyIdToken({});
    // console.log('username is', loginTicket.getUsername());

    const productService = new client.service.Product({
        endpoint: process.env.API_ENDPOINT,
        auth: authClient,
        project: { id: projectId }
    });

    const { data } = await productService.search({
        typeOf: { $eq: client.factory.service.paymentService.PaymentServiceType.CreditCard }
    });
    console.log(data.length, 'paymentServices returned');
    data.forEach((paymentService) => {
        console.log('----------------------------------------------');
        const paymentMethodType = (paymentService.serviceType !== undefined) ? paymentService.serviceType.codeValue : undefined;
        console.log('決済方法区分:', paymentMethodType);
        const providerCount = Array.isArray(paymentService.provider) ? paymentService.provider.length : 0;
        console.log(providerCount, '件の販売者が提供しています');
        if (providerCount > 0) {
            console.log('ひとつめの販売者について...');
            const credentials = paymentService.provider[0].credentials;
            let shopId;
            let tokenizationCode;
            let paymentUrl;
            if (credentials !== undefined) {
                shopId = credentials.shopId;
                tokenizationCode = credentials.tokenizationCode;
                paymentUrl = credentials.paymentUrl;
            }
            console.log('ショップID:', shopId);
            if (typeof paymentUrl === 'string' && paymentUrl.length > 0) {
                console.log('外部決済URLを発行する必要があります(トークンでの決済承認は不可)');
            } else {
                if (typeof tokenizationCode === 'string' && tokenizationCode.length > 0) {
                    console.log('トークン化はSonyPaymentで対応');
                } else {
                    console.log('トークン化はGMOで対応');
                }
            }
        }
    });
}

main().then(() => {
    console.log('success!');
}).catch(console.error);

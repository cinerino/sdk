/**
 * 決済カード照会
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

const paymentService = new client.service.Payment({
    endpoint: process.env.API_ENDPOINT,
    auth: authClient,
    project: { id: projectId }
});

async function main() {
    const paymentCard = await paymentService.checkPaymentCard({
        object: {
            typeOf: 'PrepaidPaymentCard',
            identifier: '50022500006',
            accessCode: '123'
        }
    });
    console.log(paymentCard);
}

async function wait(waitInMilliseconds) {
    return new Promise((resolve) => setTimeout(resolve, waitInMilliseconds));
}

main().then(() => {
    console.log('success!');
}).catch(console.error);

exports.main = main;
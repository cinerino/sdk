/**
 * 注文トークンによる口座開設サンプル
 */
const client = require('../lib/index');

async function main() {
    const authClient = new client.auth.ClientCredentials({
        domain: process.env.TEST_AUTHORIZE_SERVER_DOMAIN,
        clientId: process.env.TEST_CLIENT_ID,
        clientSecret: process.env.TEST_CLIENT_SECRET,
        scopes: [],
        state: ''
    });

    const accountService = new client.service.Account({
        endpoint: process.env.API_ENDPOINT,
        auth: authClient,
        project: { id: 'cinerino' }
    });

    await accountService.openByToken({
        instrument: {
            token: 'xxx'
        },
        object: {
            typeOf: 'Account',
            initialBalance: 10
        }
    });
    console.log('account opened');
}

main().then(() => {
    console.log('success!');
}).catch(console.error);

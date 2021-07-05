/**
 * サービスアウトプット所有権コード発行
 */
const decode = require('jwt-decode');
// const auth = require('./auth');
// const authAsAdmin = require('./authAsAdmin');
const client = require('../lib/index');

const project = { id: 'cinerino' };

async function main() {
    // ここからエンドユーザー
    const authClient = new client.auth.ClientCredentials({
        domain: process.env.TEST_AUTHORIZE_SERVER_DOMAIN,
        clientId: process.env.TEST_CLIENT_ID,
        clientSecret: process.env.TEST_CLIENT_SECRET,
        scopes: [],
        state: ''
    });

    const outputService = new client.service.ServiceOutput({
        endpoint: process.env.API_ENDPOINT,
        auth: authClient,
        project: project
    });
    const tokenService = new client.service.Token({
        endpoint: process.env.API_ENDPOINT,
        auth: authClient,
        project: project
    });

    const identifier = '581637641267608';
    const accessCode = '5678';
    const { code } = await outputService.authorize({
        object: { identifier, accessCode }
    });
    console.log('code published.', code);

    // 受け取ったコードをトークンに変換
    console.log('getting token by code...');
    const { token } = await tokenService.getToken({ code });
    console.log('token created.', token);
    console.log('token created.', token.substr(0, 10), '................', token.substr(-10));
    // トークン(jsonwebtoken)をデコード(デコード結果は所有権)
    const payload = decode(token);
    const output = payload.typeOfGood;
    console.log('token decoded. output is', output.typeOf, output.identifier);
}

main().then(() => {
    console.log('success!');
}).catch(console.error);

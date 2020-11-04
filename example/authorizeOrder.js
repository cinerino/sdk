/**
 * 確認番号で注文検索 & コード発行 & 管理者によるコードチェックサンプル
 */
const decode = require('jwt-decode');
const auth = require('./auth');
const authAsAdmin = require('./authAsAdmin');
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
    // const authClient = await auth.login();
    // await authClient.refreshAccessToken();
    // const loginTicket = authClient.verifyIdToken({});
    // console.log('username is', loginTicket.getUsername());

    let orderService = new client.service.Order({
        endpoint: process.env.API_ENDPOINT,
        auth: authClient,
        project: project
    });
    // 電話番号を使用して注文に対してコードを発行
    const confirmationNumber = '2701';
    const telephone = '+81362778824';
    let order = await orderService.findByConfirmationNumber({
        confirmationNumber: confirmationNumber,
        customer: {
            telephone: telephone
        },
        // orderNumber: 'CIN8-6497443-8883376'
    });
    console.log('order found');
    const { code } = await orderService.authorize({
        object: {
            orderNumber: order.orderNumber,
            customer: {
                telephone: telephone
            },
        },
        result: {
            expiresInSeconds: 60
        }
    });
    console.log('QR code published.', code);
    // ここまでエンドユーザー

    const reservationId = order.acceptedOffers[0].itemOffered.id;

    // ここから管理者ユーザー
    const adminAuthClient = await authAsAdmin.login();

    const tokenService = new client.service.Token({
        endpoint: process.env.API_ENDPOINT,
        auth: adminAuthClient,
        project: project
    });
    const reservationService = new client.service.Reservation({
        endpoint: process.env.API_ENDPOINT,
        auth: adminAuthClient,
        project: project
    });

    // 受け取ったコードをトークンに変換
    console.log('getting token by code...');
    const { token } = await tokenService.getToken({ code });
    console.log('token created.', token.substr(0, 10), '................', token.substr(-10));
    // トークン(jsonwebtoken)をデコード(デコード結果は注文)
    const payload = decode(token);
    order = payload;
    console.log('token decoded. order is', order.typeOf, order.orderNumber);

    // 入場
    console.log('checking token...');
    await reservationService.useByToken({
        object: { id: reservationId },
        instrument: { token: token }
    });
    console.log('token is valid');

    // 入場履歴を検索
    console.log('searching actions...');
    const searchUseActionsResult = await reservationService.searchUseActions({ object: { id: reservationId } });
    console.log(searchUseActionsResult.data.length, 'actions returned');
    // ここまで管理者ユーザー
}

main().then(() => {
    console.log('success!');
}).catch(console.error);

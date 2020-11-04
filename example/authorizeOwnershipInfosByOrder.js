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

    const orderService = new client.service.Order({
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
        }
    });
    console.log('order found');
    order = await orderService.authorizeOwnershipInfos({
        orderNumber: order.orderNumber,
        customer: {
            telephone: telephone
        },
        // expiresInSeconds: 0
    });
    const code = order.acceptedOffers[0].itemOffered.reservedTicket.ticketToken;
    console.log('QR code published.', code);
    // ここまでエンドユーザー

    // ここから管理者ユーザー
    const adminAuthClient = await authAsAdmin.login();
    const ownershipInfoService = new client.service.OwnershipInfo({
        endpoint: process.env.API_ENDPOINT,
        auth: adminAuthClient,
        project: project
    });
    const reservationService = new client.service.Reservation({
        endpoint: process.env.API_ENDPOINT,
        auth: adminAuthClient,
        project: project
    });

    // ある上映イベントの予約を検索
    const searchReservationsResult = await reservationService.search({
        limit: 100,
        page: 1,
        sort: { reservationNumber: client.factory.chevre.sortType.Ascending },
        reservationStatuses: [
            client.factory.chevre.reservationStatusType.ReservationConfirmed,
            client.factory.chevre.reservationStatusType.ReservationCancelled,
            client.factory.chevre.reservationStatusType.ReservationHold,
            client.factory.chevre.reservationStatusType.ReservationPending
        ],
        reservationFor: {
            typeOf: client.factory.chevre.eventType.ScreeningEvent,
            id: 'bkeuvae59'
        }
    });
    console.log(searchReservationsResult.totalCount, 'reservations found');
    console.log(searchReservationsResult.data.length, 'reservations returned');

    // 受け取ったコードをトークンに変換
    console.log('getting token by code...');
    const { token } = await ownershipInfoService.getToken({ code });
    console.log('token created.', token.substr(0, 10), '................', token.substr(-10));
    // トークン(jsonwebtoken)をデコード(デコード結果は所有権)
    const payload = decode(token);
    const reservationByToken = payload.typeOfGood;
    console.log('token decoded. reservation is', reservationByToken.typeOf, reservationByToken.id);

    // 利用可能な予約かどうか確認
    const availableReservation = searchReservationsResult.data
        .filter((r) => r.reservationStatus === client.factory.chevre.reservationStatusType.ReservationConfirmed)
        .find((r) => r.id === reservationByToken.id);
    const isAvailable = availableReservation !== undefined;
    console.log('is available?', isAvailable);

    // ベストエフォートでトークンをリモートチェック(チェックすれば履歴が残る)
    console.log('checking token...');
    await reservationService.findScreeningEventReservationByToken({ token: token });
    console.log('token is valid');

    // トークンのチェック履歴を検索
    console.log('searching actions...');
    const searchCheckActionsResult = await ownershipInfoService.searchCheckTokenActions({ id: payload.id });
    console.log(searchCheckActionsResult.data.length, 'actions returned');
    // ここまで管理者ユーザー
}

main().then(() => {
    console.log('success!');
}).catch(console.error);

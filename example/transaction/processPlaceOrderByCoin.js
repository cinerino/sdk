/**
 * コイン口座決済による注文プロセス
 */
const moment = require('moment');
const auth = require('../auth');
const client = require('../../lib/index');

async function main() {
    const authClient = await auth.login();
    await authClient.refreshAccessToken();
    const loginTicket = authClient.verifyIdToken({});
    console.log('username is', loginTicket.getUsername());

    const eventService = new client.service.Event({
        endpoint: process.env.API_ENDPOINT,
        auth: authClient
    });
    const organizationService = new client.service.Organization({
        endpoint: process.env.API_ENDPOINT,
        auth: authClient
    });
    const placeOrderService = new client.service.transaction.PlaceOrder({
        endpoint: process.env.API_ENDPOINT,
        auth: authClient
    });
    const personService = new client.service.Person({
        endpoint: process.env.API_ENDPOINT,
        auth: authClient
    });
    const personOwnershipInfoService = new client.service.person.OwnershipInfo({
        endpoint: process.env.API_ENDPOINT,
        auth: authClient
    });
    const ownershipInfoService = new client.service.OwnershipInfo({
        endpoint: process.env.API_ENDPOINT,
        auth: authClient
    });

    console.log('finding profile...');
    const profile = await personService.getProfile({ personId: 'me' });
    console.log('profile found');

    // 決済に使用するコイン口座を決定する
    let accountOwnershipInfo;
    console.log('searching accounts...');
    const searchAccountsResult = await personOwnershipInfoService.search({
        personId: 'me',
        typeOfGood: {
            typeOf: client.factory.ownershipInfo.AccountGoodType.Account,
            accountType: client.factory.accountType.Coin
        }
    });
    const accountOwnershipInfos = searchAccountsResult.data
        .filter((a) => a.typeOfGood.status === client.factory.pecorino.accountStatusType.Opened);
    if (accountOwnershipInfos.length === 0) {
        console.log('opening account...');
        accountOwnershipInfo = await personOwnershipInfoService.openAccount({
            personId: 'me',
            name: loginTicket.getUsername(),
            accountType: client.factory.accountType.Coin
        });
        console.log('account opened', accountOwnershipInfo.typeOfGood.accountNumber);
    } else {
        accountOwnershipInfo = accountOwnershipInfos[0];
    }
    console.log('your coin balance is', accountOwnershipInfo.typeOfGood.balance);

    // 販売劇場検索
    const searchMovieTheatersResult = await organizationService.searchMovieTheaters({});
    const seller = searchMovieTheatersResult.data[0];
    if (seller === undefined) {
        throw new Error('No seller');
    }

    // イベント検索
    const searchScreeningEventsResult = await eventService.searchScreeningEvents({
        // superEventLocationIdentifiers: [seller.identifier],
        inSessionFrom: moment().toDate(),
        inSessionThrough: moment().add(1, 'week').toDate()
    });
    console.log(searchScreeningEventsResult.totalCount, 'events found');

    const availableEvents = searchScreeningEventsResult.data;
    // const availableEvents = screeningEvents.filter(
    //     (event) => (event.offer.availability !== 0)
    // );
    if (availableEvents.length === 0) {
        throw new Error('No available events');
    }
    const screeningEvent = availableEvents[Math.floor(availableEvents.length * Math.random())];

    console.log('starting transaction...');
    const transaction = await placeOrderService.start({
        expires: moment().add(30, 'minutes').toDate(),
        seller: {
            typeOf: seller.typeOf,
            id: seller.id
        },
        object: {}
    });
    console.log('transaction started', transaction.id);

    // 券種検索
    let ticketOffers = await eventService.searchScreeningEventTicketOffers({
        event: { id: screeningEvent.id },
        seller: { typeOf: seller.typeOf, id: seller.id },
        store: { id: process.env.TEST_CLIENT_ID },
    });
    console.log('チケットオファーは以下の通りです')
    console.log(ticketOffers.map((o) => {
        const unitPriceSpecification = o.priceSpecification.priceComponent
            .filter((s) => s.typeOf === client.factory.chevre.priceSpecificationType.UnitPriceSpecification)
            .shift();
        const videoFormatCharge = o.priceSpecification.priceComponent
            .filter((s) => s.typeOf === client.factory.chevre.priceSpecificationType.VideoFormatChargeSpecification)
            .map((s) => `+${s.appliesToVideoFormat}チャージ:${s.price} ${s.priceCurrency}`).join(' ')
        const soundFormatCharge = o.priceSpecification.priceComponent
            .filter((s) => s.typeOf === client.factory.chevre.priceSpecificationType.SoundFormatChargeSpecification)
            .map((s) => `+${s.appliesToSoundFormat}チャージ:${s.price} ${s.priceCurrency}`).join(' ')
        return `${o.id} ${o.name.ja} ${unitPriceSpecification.price} ${o.priceCurrency} ${videoFormatCharge} ${soundFormatCharge}`
    }).join('\n'));

    // 空席検索
    const offers = await eventService.searchScreeningEventOffers({ eventId: screeningEvent.id });
    console.log(offers.length, 'offers found');
    const seatOffers = offers[0].containsPlace;
    console.log(seatOffers.length, 'seatOffers found');
    const availableSeatOffers = seatOffers.filter((o) => o.offers[0].availability === client.factory.chevre.itemAvailability.InStock);
    console.log(availableSeatOffers.length, 'availableSeatOffers found');
    if (availableSeatOffers.length <= 0) {
        throw new Error('No available seats');
    }

    // ムビチケ以外のオファーを選択
    ticketOffers = ticketOffers.filter((offer) => {
        const movieTicketTypeChargeSpecification = offer.priceSpecification.priceComponent.find(
            (component) => component.typeOf === client.factory.chevre.priceSpecificationType.MovieTicketTypeChargeSpecification
        );
        return movieTicketTypeChargeSpecification === undefined;
    });
    const selectedTicketOffer = ticketOffers.shift();
    console.log('ticket offer selected', selectedTicketOffer.id);

    console.log('ticket type selected', selectedTicketOffer.id);
    // 座席をランダムに選択
    const selectedScreeningRoomSection = offers[0].branchCode;
    console.log('screening room section selected', selectedScreeningRoomSection);
    console.log(selectedScreeningRoomSection);
    const selectedSeatOffer = availableSeatOffers[Math.floor(availableSeatOffers.length * Math.random())];
    console.log('seat selected', selectedSeatOffer.branchCode);

    await wait(5000);
    console.log('authorizing seat reservation...');
    const seatReservationAuth = await placeOrderService.authorizeSeatReservation({
        transactionId: transaction.id,
        event: {
            id: screeningEvent.id
        },
        acceptedOffer: [
            {
                id: selectedTicketOffer.id,
                ticketedSeat: {
                    seatNumber: selectedSeatOffer.branchCode,
                    seatSection: selectedScreeningRoomSection
                }
            }
        ],
        notes: 'test from samples'
    });
    console.log('seat reservation authorized', seatReservationAuth.id);

    // 口座にコード発行
    const { code } = await personOwnershipInfoService.authorize({
        personId: 'me',
        ownershipInfoId: accountOwnershipInfo.id
    });
    // 口座所有権をトークン化
    const { token } = await ownershipInfoService.getToken({ code });

    // 金額計算
    if (seatReservationAuth.result === undefined) {
        throw new Error('座席予約承認結果は必ず存在します');
    }
    let amount = seatReservationAuth.result.price;
    console.log('金額は', amount);

    // 口座オーソリアクション
    console.log('authorizing account payment...', token);
    const paymentAuth = await placeOrderService.authorizeAccountPayment({
        typeOf: client.factory.paymentMethodType.Account,
        transactionId: transaction.id,
        amount: amount,
        // fromAccount: {
        //     accountType: client.factory.accountType.Coin,
        //     accountNumber: accountOwnershipInfo.typeOfGood.accountNumber
        // }
        fromAccount: token
    });
    console.log('account payment authorized', paymentAuth.id);

    // 購入者情報入力時間
    // tslint:disable-next-line:no-magic-numbers
    await wait(5000);

    console.log('setting customer contact...');
    await placeOrderService.setCustomerContact({
        transactionId: transaction.id,
        contact: {
            givenName: 'Taro',
            familyName: 'Motion',
            telephone: '+819012345678s',
            email: profile.email
        }
    });
    console.log('customer contact set');

    // 購入情報確認時間
    // tslint:disable-next-line:no-magic-numbers
    await wait(5000);

    // 取引を中止する場合はコチラ↓
    // console.log('取引を中止します...');
    // await placeOrderService.cancel({ transactionId: transaction.id });
    // console.log('取引を中止しました。');

    console.log('confirming transaction...');
    const result = await placeOrderService.confirm({
        transactionId: transaction.id,
        sendEmailMessage: true
    });
    console.log('transaction confirmed', result.order.orderNumber);
}

async function wait(waitInMilliseconds) {
    return new Promise((resolve) => setTimeout(resolve, waitInMilliseconds));
}

main().then(() => {
    console.log('success!');
}).catch(console.error);

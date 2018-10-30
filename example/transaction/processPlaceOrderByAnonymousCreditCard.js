/**
 * クレジットカード決済による注文プロセス
 */
const moment = require('moment');
const client = require('../../lib/index');

async function main() {
    const authClient = new client.auth.ClientCredentials({
        domain: process.env.TEST_AUTHORIZE_SERVER_DOMAIN,
        clientId: process.env.TEST_CLIENT_ID,
        clientSecret: process.env.TEST_CLIENT_SECRET,
        scopes: [],
        state: ''
    });

    const eventService = new client.service.Event({
        endpoint: process.env.API_ENDPOINT,
        auth: authClient
    });
    const organizationService = new client.service.Organization({
        endpoint: process.env.API_ENDPOINT,
        auth: authClient
    });
    const placeOrderService = new client.service.txn.PlaceOrder({
        endpoint: process.env.API_ENDPOINT,
        auth: authClient
    });

    // 取引に使用するクレジットカードを決定する
    let creditCard = {
        cardNo: '4111111111111111',
        expire: '2412',
        holderName: 'AA BB'
    };

    // 販売劇場検索
    const searchMovieTheatersResult = await organizationService.searchMovieTheaters({});
    const seller = searchMovieTheatersResult.data[Math.floor(searchMovieTheatersResult.data.length * Math.random())];
    if (seller === undefined) {
        throw new Error('No seller');
    }
    console.log('ordering from seller...', seller.name.ja);

    // イベント検索
    const searchScreeningEventsResult = await eventService.searchScreeningEvents({
        // superEventLocationIdentifiers: [seller.identifier],
        inSessionFrom: moment().toDate(),
        inSessionThrough: moment().add(1, 'week').toDate(),
        superEvent: { locationBranchCodes: [seller.location.branchCode] }
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

    // WAITER許可証
    // const passportToken = await request.post(
    //     `${process.env.WAITER_ENDPOINT}/passports`,
    //     {
    //         body: {
    //             scope: `Transaction:PlaceOrder:${seller.id}`
    //         },
    //         json: true
    //     }
    // ).then((body) => body.token).catch((err) => {
    //     throw new Error(err.message);
    // });
    // console.log('passportToken published', passportToken);

    console.log('starting transaction...');
    const transaction = await placeOrderService.start({
        expires: moment().add(10, 'minutes').toDate(),
        agent: {
            identifier: [
                {
                    name: 'SampleName',
                    value: 'SampleValue'
                }
            ]
        },
        seller: {
            typeOf: seller.typeOf,
            id: seller.id
        },
        object: {
            // passport: { token: passportToken }
        }
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

    // 座席をランダムに選択
    const selectedScreeningRoomSection = offers[0].branchCode;
    console.log('screening room section selected', selectedScreeningRoomSection);
    console.log(selectedScreeningRoomSection);
    const selectedSeatOffer = availableSeatOffers[Math.floor(availableSeatOffers.length * Math.random())];
    console.log('seat selected', selectedSeatOffer.branchCode);

    await wait(5000);
    console.log('authorizing seat reservation...');
    let seatReservationAuth = await placeOrderService.authorizeSeatReservation({
        object: {
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
        },
        purpose: transaction
    });
    console.log('seat reservation authorized', seatReservationAuth.id);

    // await wait(5000);
    // console.log('voiding seat reservation auth...');
    // await placeOrderService.voidSeatReservation({ transactionId: transaction.id, actionId: seatReservationAuth.id });
    // console.log('seat reservation auth voided');

    // 金額計算
    if (seatReservationAuth.result === undefined) {
        throw new Error('座席予約承認結果は必ず存在します');
    }
    let amount = seatReservationAuth.result.price;
    console.log('金額は', amount);

    // クレジットカードオーソリアクション
    console.log('authorizing credit card payment...');
    let creditCardPaymentAuth = await placeOrderService.authorizeCreditCardPayment({
        object: {
            typeOf: client.factory.paymentMethodType.CreditCard,
            amount: amount,
            orderId: `SAMPLE-${moment().unix().toString()}-${`000${Math.floor(100 * Math.random())}`.slice(-3)}`,
            method: '1',
            payType: '0',
            creditCard: creditCard
        },
        purpose: transaction
    });
    console.log('credit card payment authorized', creditCardPaymentAuth.id);

    await wait(5000);

    console.log('voiding credit card auth...');
    await placeOrderService.voidPayment(creditCardPaymentAuth);
    console.log('credit card auth voided');

    console.log('authorizing credit card payment...');
    creditCardPaymentAuth = await placeOrderService.authorizeCreditCardPayment({
        object: {
            typeOf: client.factory.paymentMethodType.CreditCard,
            amount: amount,
            orderId: `SAMPLE-${moment().unix().toString()}-${`000${Math.floor(100 * Math.random())}`.slice(-3)}`,
            method: '1',
            payType: '0',
            creditCard: creditCard
        },
        purpose: transaction
    });
    console.log('credit card payment authorized', creditCardPaymentAuth.id);

    // 購入者情報入力時間
    // tslint:disable-next-line:no-magic-numbers
    await wait(5000);

    console.log('setting customer contact...');
    await placeOrderService.setCustomerContact({
        id: transaction.id,
        object: {
            customerContact: {
                givenName: 'Taro',
                familyName: 'Motion',
                telephone: '+819012345678',
                email: 'hello@motionpicture.jp'
            }
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
    let result = await placeOrderService.confirm({
        id: transaction.id,
        options: {
            sendEmailMessage: true
        }
    });
    console.log('transaction confirmed', result.order.orderNumber);
    // 何度確定をコールしても冪等
    console.log('confirming transaction...');
    result = await placeOrderService.confirm({
        id: transaction.id,
        options: {
            sendEmailMessage: true
        }
    });
    console.log('transaction confirmed', result.order.orderNumber);
    // 何度確定をコールしても冪等
    console.log('confirming transaction...');
    result = await placeOrderService.confirm({
        id: transaction.id,
        options: {
            sendEmailMessage: true
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
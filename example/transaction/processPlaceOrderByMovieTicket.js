/**
 * ムビチケ決済による注文プロセス
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
    const sellerService = new client.service.Seller({
        endpoint: process.env.API_ENDPOINT,
        auth: authClient
    });
    const placeOrderService = new client.service.txn.PlaceOrder({
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
    const paymentService = new client.service.Payment({
        endpoint: process.env.API_ENDPOINT,
        auth: authClient
    });

    console.log('finding profile...');
    const profile = await personService.getProfile({ personId: 'me' });
    console.log('profile found');

    // 取引に使用するクレジットカードを決定する
    let creditCard;
    console.log('searching credit cards...');
    let creditCards = await personOwnershipInfoService.searchCreditCards({
        personId: 'me'
    });
    creditCards = creditCards.filter((c) => c.deleteFlag === '0');
    if (creditCards.length === 0) {
        console.log('adding credit card...');
        creditCard = await personService.addCreditCard({
            personId: 'me',
            creditCard: {
                cardNo: '4111111111111111',
                expire: '2020',
                holderName: 'AA BB'
            }
        });
        console.log('credit card added', creditCard.cardSeq);
    } else {
        creditCard = creditCards[0];
    }
    console.log('using credit card...', creditCard.cardSeq);

    // 販売劇場検索
    const searchSellersResult = await sellerService.search({});
    const seller = searchSellersResult.data[Math.floor(searchSellersResult.data.length * Math.random())];
    if (seller === undefined) {
        throw new Error('No seller');
    }
    console.log('ordering from seller...', seller.name.ja);

    // イベント検索
    const searchScreeningEventsResult = await eventService.search({
        typeOf: client.factory.chevre.eventType.ScreeningEvent,
        // superEventLocationIdentifiers: [seller.identifier],
        inSessionFrom: moment().toDate(),
        inSessionThrough: moment().add(2, 'days').toDate(),
        superEvent: {
            locationBranchCodes: [seller.location.branchCode],
            workPerformedIdentifiers: ['16421']
        }
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
    // const screeningEvent = { id: '405gzn58jnbbx50a' };
    console.log('Event:', screeningEvent.id, 'で取引を進行します');

    const movieTickets = [
        {
            typeOf: client.factory.paymentMethodType.MovieTicket,
            identifier: '3198910596',
            accessCode: '3896'
        },
        // {
        //     typeOf: client.factory.paymentMethodType.MovieTicket,
        //     identifier: '6095915590',
        //     accessCode: '3896'
        // }
    ];

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
    let ticketOffers = await eventService.searchTicketOffers({
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
        const movieTicketTypeCharge = o.priceSpecification.priceComponent
            .filter((s) => s.typeOf === client.factory.chevre.priceSpecificationType.MovieTicketTypeChargeSpecification)
            .map((s) => `+${s.appliesToVideoFormat}チャージ:${s.price} ${s.priceCurrency}`).join(' ')

        return `${o.id} ${o.name.ja} ${unitPriceSpecification.price} ${o.priceCurrency} ${videoFormatCharge} ${soundFormatCharge} ${movieTicketTypeCharge}`
    }).join('\n'));

    // 空席検索
    const offers = await eventService.searchOffers({ event: screeningEvent });
    console.log(offers.length, 'offers found');
    const seatOffers = offers[0].containsPlace;
    console.log(seatOffers.length, 'seatOffers found');
    const availableSeatOffers = seatOffers.filter((o) => o.offers[0].availability === client.factory.chevre.itemAvailability.InStock);
    console.log(availableSeatOffers.length, 'availableSeatOffers found');
    if (availableSeatOffers.length <= 0) {
        throw new Error('No available seats');
    }

    // ムビチケオファーを選択
    ticketOffers = ticketOffers.filter((offer) => {
        const movieTicketTypeChargeSpecification = offer.priceSpecification.priceComponent.find(
            (component) => component.typeOf === client.factory.chevre.priceSpecificationType.MovieTicketTypeChargeSpecification
        );
        return movieTicketTypeChargeSpecification !== undefined;
    });
    const selectedTicketOffer = ticketOffers.shift();
    if (selectedTicketOffer === undefined) {
        throw new Error('ムビチケオファーが見つかりません');
    }
    console.log('ticket type selected', selectedTicketOffer.id);
    // 座席をランダムに選択
    const selectedScreeningRoomSection = offers[0].branchCode;
    console.log('screening room section selected', selectedScreeningRoomSection);
    console.log(selectedScreeningRoomSection);
    const selectedSeatOffers = availableSeatOffers.slice(0, 2);
    console.log('seat selected', selectedSeatOffers.map((o) => o.branchCode).join(','));

    await wait(5000);
    console.log('authorizing seat reservation...');
    let seatReservationAuth = await placeOrderService.authorizeSeatReservation({
        object: {
            event: {
                id: screeningEvent.id
            },
            acceptedOffer: selectedSeatOffers.map((selectedSeatOffer) => {
                return {
                    id: selectedTicketOffer.id,
                    ticketedSeat: {
                        seatNumber: selectedSeatOffer.branchCode,
                        seatSection: selectedScreeningRoomSection
                    },
                    paymentMethod: movieTickets[0]
                };
            }),
            notes: 'test from samples'
        },
        purpose: transaction
    });
    console.log('seat reservation authorized', seatReservationAuth.id);

    // 金額計算
    if (seatReservationAuth.result === undefined) {
        throw new Error('座席予約承認結果は必ず存在します');
    }
    // const pendingReservations = seatReservationAuth.result.responseBody.object.reservations;
    let amount = seatReservationAuth.result.price;
    console.log('金額は', amount);

    await wait(5000);

    // ムビチケ認証
    const checkMovieTicketAction = await paymentService.checkMovieTicket({
        typeOf: client.factory.paymentMethodType.MovieTicket,
        movieTickets: movieTickets.map((movieTicket) => {
            return {
                ...movieTicket,
                serviceType: '', // 情報空でよし
                serviceOutput: {
                    reservationFor: {
                        typeOf: screeningEvent.typeOf,
                        id: screeningEvent.id
                    },
                    reservedTicket: {
                        ticketedSeat: {
                            typeOf: client.factory.chevre.placeType.Seat,
                            seatingType: '', // 情報空でよし
                            seatNumber: '', // 情報空でよし
                            seatRow: '', // 情報空でよし
                            seatSection: '' // 情報空でよし
                        }
                    }
                }
            };
        }),
        seller: { typeOf: transaction.seller.typeOf, id: transaction.seller.id },
    });
    console.log('movie ticket:', checkMovieTicketAction);
    const checkMovieTicketActionResult = checkMovieTicketAction.result;
    if (checkMovieTicketActionResult === undefined) {
        throw new Error('認証結果は必ず存在します');
    }

    const availableMovieTickets = checkMovieTicketActionResult.movieTickets.filter((t) => t.validThrough === undefined);
    if (availableMovieTickets.length === 0) {
        throw new Error('有効なムビチケが存在しません');
    }
    const movieTicketTypeChargeSpecification = selectedTicketOffer.priceSpecification.priceComponent.find(
        (component) => component.typeOf === client.factory.chevre.priceSpecificationType.MovieTicketTypeChargeSpecification
    );
    let selectedMovieTickets = availableMovieTickets;
    // let selectedMovieTickets = availableMovieTickets.filter((t) => t.serviceType === movieTicketTypeChargeSpecification.appliesToMovieTicketType);
    // if (selectedMovieTickets.length === 0) {
    //     throw new Error(`券種区分 ${movieTicketTypeChargeSpecification.appliesToMovieTicketType} の有効なムビチケが見つかりません`);
    // }
    // if (selectedMovieTickets.length < selectedSeatOffers.length) {
    //     throw new Error('有効なムビチケが足りません');
    // }
    selectedMovieTickets = selectedMovieTickets.slice(0, selectedSeatOffers.length);

    // ムビチケ承認アクション
    console.log('authorizing mvtk payment...');
    let movieTicketPaymentAuths = await Promise.all(selectedMovieTickets.map(async (movieTicket, index) => {
        // const reservation = pendingReservations[index];
        const selectedSeatOffer = selectedSeatOffers[index];

        return placeOrderService.authorizeMovieTicketPayment({
            object: {
                typeOf: client.factory.paymentMethodType.MovieTicket,
                amount: 0,
                movieTickets: [{
                    ...movieTicket,
                    serviceOutput: {
                        reservationFor: {
                            typeOf: screeningEvent.typeOf,
                            id: screeningEvent.id
                        },
                        reservedTicket: {
                            ticketedSeat: {
                                seatNumber: selectedSeatOffer.branchCode,
                                seatSection: selectedScreeningRoomSection
                            }
                        }
                    }
                }]
            },
            purpose: transaction
        });
    }));
    console.log(movieTicketPaymentAuths.length, 'mvtk payment authorized');

    await wait(5000);

    console.log('voiding mvtk auth...');
    await Promise.all(movieTicketPaymentAuths.map(async (movieTicketPaymentAuth) => {
        await placeOrderService.voidPayment(movieTicketPaymentAuth);
    }))
    console.log('mvtk auth voided');

    console.log('authorizing mvtk payment...');
    movieTicketPaymentAuths = await Promise.all(selectedMovieTickets.map(async (movieTicket, index) => {
        // const reservation = pendingReservations[index];
        const selectedSeatOffer = selectedSeatOffers[index];

        return placeOrderService.authorizeMovieTicketPayment({
            object: {
                typeOf: client.factory.paymentMethodType.MovieTicket,
                amount: 0,
                movieTickets: [{
                    ...movieTicket,
                    serviceOutput: {
                        reservationFor: {
                            typeOf: screeningEvent.typeOf,
                            id: screeningEvent.id
                        },
                        reservedTicket: {
                            ticketedSeat: {
                                seatNumber: selectedSeatOffer.branchCode,
                                seatSection: selectedScreeningRoomSection
                            }
                        }
                    }
                }]
            },
            purpose: transaction
        });
    }));
    console.log(movieTicketPaymentAuths.length, 'mvtk payment authorized');

    // 購入者情報入力時間
    // tslint:disable-next-line:no-magic-numbers
    await wait(5000);

    // お直り金額があればクレジットカード決済
    if (amount > 0) {
        console.log('authorizing credit card payment...');
        const creditCardPaymentAuth = await placeOrderService.authorizeCreditCardPayment({
            object: {
                typeOf: client.factory.paymentMethodType.CreditCard,
                amount: amount,
                orderId: `SAMPLE-${moment().unix().toString()}`,
                method: '1',
                creditCard: {
                    memberId: 'me',
                    cardSeq: creditCard.cardSeq
                    // cardPass: ''
                }
            },
            purpose: transaction
        });
        console.log('credit card payment authorized', creditCardPaymentAuth.id);

        await wait(5000);
    }

    console.log('setting customer contact...');
    await placeOrderService.setCustomerContact({
        id: transaction.id,
        object: {
            customerContact: {
                givenName: 'Taro',
                familyName: 'Motion',
                telephone: '+819012345678',
                email: profile.email
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

exports.main = main;
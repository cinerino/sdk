/**
 * クレジットカード決済とメンバーシップによる注文プロセス
 */
const moment = require('moment');
const client = require('../../lib/index');

const authClient = new client.auth.ClientCredentials({
    domain: process.env.TEST_AUTHORIZE_SERVER_DOMAIN,
    clientId: process.env.TEST_CLIENT_ID,
    clientSecret: process.env.TEST_CLIENT_SECRET,
    scopes: [],
    state: ''
});

const projectId = 'cinerino';

const eventService = new client.service.Event({
    endpoint: process.env.API_ENDPOINT,
    auth: authClient,
    project: { id: projectId }
});

const sellerService = new client.service.Seller({
    endpoint: process.env.API_ENDPOINT,
    auth: authClient,
    project: { id: projectId }
});

const placeOrderService = new client.service.txn.PlaceOrder({
    endpoint: process.env.API_ENDPOINT,
    auth: authClient,
    project: { id: projectId }
});

const paymentService = new client.service.Payment({
    endpoint: process.env.API_ENDPOINT,
    auth: authClient,
    project: { id: projectId }
});

const informUrl = 'https://cinerino-telemetry-api-development.azurewebsites.net/organizations/project/cinerino/lineNotify';

async function main() {
    // 取引に使用するクレジットカードを決定する
    let creditCard = {
        cardNo: '4111111111111111',
        expire: '2412',
        holderName: 'AA BB'
    };

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
        inSessionThrough: moment().add(1, 'week').toDate(),
        // superEvent: { locationBranchCodes: [seller.location.branchCode] }
    });
    console.log(searchScreeningEventsResult.totalCount, 'events found');

    const availableEvents = searchScreeningEventsResult.data;
    // const availableEvents = screeningEvents.filter(
    //     (event) => (event.offer.availability !== 0)
    // );
    if (availableEvents.length === 0) {
        throw new Error('No available events');
    }

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
        agent: {},
        seller: {
            typeOf: seller.typeOf,
            id: seller.id
        },
        object: {
            // passport: { token: passportToken }
        }
    });
    console.log('transaction started', transaction.id);

    // 購入者情報入力時間
    // tslint:disable-next-line:no-magic-numbers
    await wait(5000);

    console.log('setting customer profile...');
    const profile = {
        additionalProperty: [{ name: 'SampleId', value: moment().unix().toString() }],
        address: 'Tokyo',
        age: '33',
        email: '',
        givenName: 'Taro',
        familyName: 'Chevre',
        gender: 'Female',
        name: 'Taro ☆ Chevre',
        telephone: '+819012345678',
    };
    await placeOrderService.setProfile({
        id: transaction.id,
        agent: profile
    });
    console.log('customer profile set');

    const numEvents = 1;
    let amount = 0;
    const authorizeSeatReservationResults = [];

    for (let i = 0; i < numEvents; i++) {
        // イベント決定
        const screeningEvent = availableEvents[Math.floor(availableEvents.length * Math.random())];
        const authorizeSeatReservationResult = await authorizeSeatReservationByEvent({
            event: screeningEvent,
            seller: seller,
            transaction: transaction
        });
        amount += authorizeSeatReservationResult.price;
        authorizeSeatReservationResults.push(authorizeSeatReservationResult);
    }

    // クレジットカードオーソリアクション
    console.log('authorizing credit card payment...');
    let creditCardPaymentAuth = await paymentService.authorizeCreditCard({
        object: {
            typeOf: client.factory.paymentMethodType.CreditCard,
            amount: amount,
            method: '1',
            creditCard: creditCard
        },
        purpose: transaction
    });
    console.log('credit card payment authorized', creditCardPaymentAuth.id);

    await wait(5000);

    console.log('voiding credit card auth...');
    await paymentService.voidTransaction({
        id: creditCardPaymentAuth.id,
        object: { typeOf: client.factory.chevre.service.paymentService.PaymentServiceType.CreditCard },
        purpose: { typeOf: transaction.typeOf, id: transaction.id }
    });
    console.log('credit card auth voided');

    console.log('authorizing credit card payment...');
    creditCardPaymentAuth = await paymentService.authorizeCreditCard({
        object: {
            typeOf: client.factory.paymentMethodType.CreditCard,
            amount: amount,
            method: '1',
            creditCard: creditCard
        },
        purpose: transaction
    });
    console.log('credit card payment authorized', creditCardPaymentAuth.id);

    // 購入情報確認時間
    // tslint:disable-next-line:no-magic-numbers
    await wait(5000);

    // 取引を中止する場合はコチラ↓
    // console.log('取引を中止します...');
    // await placeOrderService.cancel({ transactionId: transaction.id });
    // console.log('取引を中止しました。');

    console.log('confirming transaction...');
    const email = {
        sender: {
            name: `♥ ${seller.name.ja} ♥`
            // email?: string;
        },
        // toRecipient: {
        //     name: 'Another recipient',
        //     email: 'ilovegadd@gmail.com'
        // },
        about: `♥♥♥ ${profile.name}さんへご注文商品が届いております ♥♥♥`,
        template: `
| Order from samples
| 
| [注文番号]
| #{order.orderNumber}
| 
| [合計]
| ￥#{order.price}
`
    };

    let result = await placeOrderService.confirm({
        id: transaction.id,
        potentialActions: {
            order: {
                potentialActions: {
                    sendOrder: {
                        potentialActions: {
                            confirmReservation: authorizeSeatReservationResults.map((result) => {
                                return {
                                    object: {
                                        typeOf: result.responseBody.typeOf,
                                        id: result.responseBody.id,
                                        object: {
                                            reservations: result.responseBody.object.reservations.map((r) => {
                                                return {
                                                    additionalTicketText: 'Custom Additional Ticket Text',
                                                    id: r.id,
                                                    reservedTicket: {
                                                        issuedBy: {
                                                            typeOf: seller.typeOf,
                                                            name: seller.name
                                                        },
                                                        ticketToken: 'Custom Ticket Token'
                                                    },
                                                    underName: {
                                                        typeOf: transaction.agent.typeOf,
                                                        id: transaction.agent.id,
                                                        name: 'Custom Name',
                                                        familyName: 'Custom Family Name',
                                                        givenName: 'Custom Given Name',
                                                        email: 'custom@example.com',
                                                        telephone: '+819012345678',
                                                        identifier: [
                                                            { name: 'transaction', value: transaction.id },
                                                            { name: 'customName', value: 'Custom NameValue' }
                                                        ]
                                                    }
                                                };
                                            })
                                        },
                                        // potentialActions: {
                                        //     reserve: {
                                        //         potentialActions: {
                                        //             informReservation: [
                                        //                 // { recipient: { url: informUrl } }
                                        //             ]
                                        //         }
                                        //     }
                                        // }
                                    }
                                }
                            }),
                            sendEmailMessage: [
                                {
                                    object: email
                                }
                            ]
                        }
                    }
                }
            }
        },
        result: {
            order: {
                identifier: [
                    { name: 'sampleOrderIdentifierName1', value: 'sampleOrderIdentifiervalue1' },
                    { name: 'sampleOrderIdentifierName2', value: 'sampleOrderIdentifiervalue2' }
                ],
                url: 'https://example.com'
            }
        },
        sendEmailMessage: true,
        email: email
    });
    console.log('transaction confirmed', result.order.orderNumber);

    // 何度確定をコールしても冪等
    console.log('confirming transaction...');
    result = await placeOrderService.confirm({
        id: transaction.id,
        sendEmailMessage: true
    });
    console.log('transaction confirmed', result.order.orderNumber);
    // 何度確定をコールしても冪等
    console.log('confirming transaction...');
    result = await placeOrderService.confirm({
        id: transaction.id,
        sendEmailMessage: true
    });
    console.log('transaction confirmed', result.order.orderNumber);
}

async function authorizeSeatReservationByEvent(params) {
    const screeningEvent = params.event;
    const seller = params.seller;
    const transaction = params.transaction;

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
            .map((s) => `単価:${s.price}/${s.referenceQuantity.value}`).join(' ');
        const videoFormatCharge = o.priceSpecification.priceComponent
            .filter((s) => s.typeOf === client.factory.chevre.priceSpecificationType.VideoFormatChargeSpecification)
            .map((s) => `+${s.appliesToVideoFormat}チャージ:${s.price} ${s.priceCurrency}`).join(' ')
        const soundFormatCharge = o.priceSpecification.priceComponent
            .filter((s) => s.typeOf === client.factory.chevre.priceSpecificationType.SoundFormatChargeSpecification)
            .map((s) => `+${s.appliesToSoundFormat}チャージ:${s.price} ${s.priceCurrency}`).join(' ')
        return `${o.id} ${o.name.ja} ${unitPriceSpecification} ${o.priceCurrency} ${videoFormatCharge} ${soundFormatCharge}`
    }).join('\n'));

    // 空席検索
    const searchSeatOffersResult = await eventService.searchSeats({ event: { id: screeningEvent.id } });
    const seatOffers = searchSeatOffersResult.data;
    // console.log(seatOffers.length, 'seatOffers found');
    // const seatOffers = offers[0].containsPlace;
    console.log(seatOffers.length, 'seatOffers found');
    const availableSeatOffers = seatOffers.filter((o) => o.offers[0].availability === client.factory.chevre.itemAvailability.InStock);
    console.log(availableSeatOffers.length, 'availableSeatOffers found');
    if (availableSeatOffers.length <= 0) {
        throw new Error('No available seats');
    }

    // ムビチケ以外のメンバーシップオファーを選択
    ticketOffers = ticketOffers
        .filter((offer) => {
            const movieTicketTypeChargeSpecification = offer.priceSpecification.priceComponent.find(
                (component) => component.typeOf === client.factory.chevre.priceSpecificationType.MovieTicketTypeChargeSpecification
            );
            return movieTicketTypeChargeSpecification === undefined;
        })
        .filter((offer) => {
            return Array.isArray(offer.eligibleMembershipType);
        })
        ;

    const selectedTicketOffer = ticketOffers.shift();
    console.log('ticket offer selected', selectedTicketOffer);

    // 座席をランダムに選択
    const selectedScreeningRoomSection = availableSeatOffers[0].containedInPlace.branchCode;
    console.log('screening room section selected', selectedScreeningRoomSection);
    console.log(selectedScreeningRoomSection);
    // const selectedSeatOffer = availableSeatOffers[Math.floor(availableSeatOffers.length * Math.random())];
    // const selectedSeatOffers = availableSeatOffers.slice(0, 3);
    const selectedSeatOffers = availableSeatOffers.slice(0, 1);
    console.log(selectedSeatOffers.length, 'seats selected');


    // アドオン選択
    // let acceptedAddOns = [];
    // if (Array.isArray(selectedTicketOffer.addOn) && selectedTicketOffer.addOn.length > 0) {
    //     acceptedAddOns = [{ id: selectedTicketOffer.addOn[0].id }];
    // }
    // console.log('addOn selected.', acceptedAddOns);

    await wait(5000);
    console.log('authorizing seat reservation...');
    let seatReservationAuth = await placeOrderService.authorizeSeatReservation({
        object: {
            reservationFor: {
                id: screeningEvent.id
            },
            acceptedOffer: selectedSeatOffers.map((o) => {
                return {
                    typeOf: selectedTicketOffer.typeOf,
                    id: selectedTicketOffer.id,
                    // addOn: acceptedAddOns,
                    itemOffered: {
                        serviceOutput: {
                            typeOf: client.factory.reservationType.EventReservation,
                            reservedTicket: {
                                typeOf: 'Ticket',
                                ticketedSeat: {
                                    typeOf: client.factory.placeType.Seat,
                                    seatNumber: o.branchCode,
                                    seatSection: selectedScreeningRoomSection,
                                    seatRow: ''
                                },
                            },
                            additionalProperty: [{ name: 'sampleName', value: 'sampleValue' }],
                            // programMembershipUsed: {
                            //     identifier: '581637641267608',
                            //     accessCode: '5678'
                            // },
                            programMembershipUsed: 'xxxxx'
                        }
                    },
                    additionalProperty: [{ name: 'sampleName', value: 'sampleValue' }],
                };
            }),
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

    const amount = seatReservationAuth.result.price;
    console.log('金額は', amount);

    return seatReservationAuth.result;
}

async function wait(waitInMilliseconds) {
    return new Promise((resolve) => setTimeout(resolve, waitInMilliseconds));
}

main().then(() => {
    console.log('success!');
}).catch(console.error);

exports.main = main;
/**
 * ムビチケ決済による注文プロセス(COA予約)
 */
const moment = require('moment');
const client = require('../../lib/index');

const project = { id: 'sskts-development' };

const authClient = new client.auth.ClientCredentials({
    domain: process.env.TEST_AUTHORIZE_SERVER_DOMAIN,
    clientId: process.env.TEST_CLIENT_ID,
    clientSecret: process.env.TEST_CLIENT_SECRET,
    scopes: [],
    state: ''
});

const movieTickets = [
    // {
    //     typeOf: client.factory.paymentMethodType.MovieTicket,
    //     identifier: "2686741478",
    //     accessCode: "3896",
    // },
    {
        typeOf: client.factory.paymentMethodType.MGTicket,
        identifier: "AA6459476",
        accessCode: "64926475679",
    }
];

async function main() {
    const placeOrderService = new client.service.txn.PlaceOrder({
        endpoint: process.env.API_ENDPOINT,
        auth: authClient,
        project: project
    });
    const placeOrder4ssktsService = new client.service.txn.PlaceOrder4sskts({
        endpoint: process.env.API_ENDPOINT,
        auth: authClient,
        project: project
    });
    const paymentService = new client.service.Payment({
        endpoint: process.env.API_ENDPOINT,
        auth: authClient,
        project: project
    });

    const seller = { typeOf: 'MovieTheater', id: '5d0abf30ac3fb200198ebb2c' };
    console.log('ordering from seller...', seller.id);

    const screeningEvent = { id: '120162210202009221200920' };
    console.log('Event:', screeningEvent.id, 'で取引を進行します');

    console.log('starting transaction...');
    const transaction = await placeOrderService.start({
        expires: moment().add(10, 'minutes').toDate(),
        agent: {
            identifier: [{ name: 'SampleName', value: 'SampleValue' }]
        },
        seller: { typeOf: seller.typeOf, id: seller.id },
        object: {}
    });
    console.log('transaction started', transaction.id);

    await wait(5000);

    const selectedSeat = {
        seatSection: '   ',
        seatNumber: 'ａ－１２',
    };

    console.log('authorizing seat reservation...');
    let seatReservationAuth = await placeOrder4ssktsService.createSeatReservationAuthorization({
        object: {
            event: {
                id: screeningEvent.id
            },
            acceptedOffer: [{
                seatSection: selectedSeat.seatSection,
                seatNumber: selectedSeat.seatNumber,
                ticketInfo: {
                    ticketCode: '8200002',
                    mvtkAppPrice: 1400,
                    ticketCount: 1,
                    addGlasses: 0,
                    kbnEisyahousiki: '01',
                    mvtkNum: movieTickets[0].identifier,
                    mvtkKbnDenshiken: '02',
                    mvtkKbnMaeuriken: '02',
                    mvtkKbnKensyu: '8200002',
                    mvtkSalesPrice: 1400,
                    kbnMgtk: 'MG'
                }
            }],
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
        typeOf: movieTickets[0].typeOf,
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
    let selectedMovieTickets = availableMovieTickets;
    selectedMovieTickets = selectedMovieTickets.slice(0, 1);

    await wait(5000);

    // ムビチケ承認アクション
    console.log('authorizing mvtk payment...');
    let movieTicketPaymentAuths = await Promise.all(selectedMovieTickets.map(async (movieTicket, index) => {
        return paymentService.authorizeMovieTicket({
            object: {
                typeOf: client.factory.action.authorize.paymentMethod.any.ResultType.Payment,
                paymentMethod: movieTickets[0].typeOf,
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
                                seatNumber: selectedSeat.seatNumber,
                                seatSection: selectedSeat.seatSection
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
    // if (amount > 0) {
    // }

    console.log('setting customer profile...');
    await placeOrderService.setProfile({
        id: transaction.id,
        agent: {
            givenName: 'Taro',
            familyName: 'Motion',
            telephone: '+819012345678',
            email: ''
        }
    });
    console.log('customer profile set');

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
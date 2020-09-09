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

const movieTickets = [
    {
        typeOf: client.factory.paymentMethodType.MovieTicket,
        identifier: "2343314517",
        accessCode: "3896",
    },
    // {
    //     typeOf: client.factory.paymentMethodType.MGTicket,
    //     identifier: "AA5919737",
    //     accessCode: "49256768349",
    // }
];

async function main() {
    // ムビチケ認証
    const checkMovieTicketAction = await paymentService.checkMovieTicket({
        typeOf: movieTickets[0].typeOf,
        movieTickets: movieTickets.map((movieTicket) => {
            return {
                ...movieTicket,
                serviceType: '', // 情報空でよし
                serviceOutput: {
                    reservationFor: {
                        typeOf: client.factory.chevre.eventType.ScreeningEvent,
                        id: '7k9ayn1y9'
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
        seller: { typeOf: client.factory.organizationType.Corporation, id: '59d20831e53ebc2b4e774466' },
    });
    console.log('movie ticket:', checkMovieTicketAction);
    const checkMovieTicketActionResult = checkMovieTicketAction.result;
    if (checkMovieTicketActionResult === undefined) {
        throw new Error('認証結果は必ず存在します');
    }
}

async function wait(waitInMilliseconds) {
    return new Promise((resolve) => setTimeout(resolve, waitInMilliseconds));
}

main().then(() => {
    console.log('success!');
}).catch(console.error);

exports.main = main;
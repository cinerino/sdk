/**
 * 決済取引サンプル
 */
const moment = require('moment');
const client = require('../../../lib/');

const auth = new client.auth.ClientCredentials({
    domain: process.env.TEST_AUTHORIZE_SERVER_DOMAIN,
    clientId: process.env.TEST_CLIENT_ID,
    clientSecret: process.env.TEST_CLIENT_SECRET,
    scopes: []
});

const payService = new client.chevre.service.assetTransaction.Pay({
    endpoint: process.env.TEST_API_ENDPOINT,
    auth: auth
});

const sellerService = new client.chevre.service.Seller({
    endpoint: process.env.TEST_API_ENDPOINT,
    auth: auth
});

const project = { id: 'cinerino' };

async function main() {

    const searchSellersResult = await sellerService.search({ project: { id: { $eq: project.id } }, limit: 1 });
    const seller = searchSellersResult.data[0];

    const transactionNumber = `CIN${(new Date()).valueOf()}`;
    const paymentMethodType = 'MGTicket';

    console.log('starting transaction...transactionNumber:', transactionNumber);
    let transaction = await payService.start({
        project: { id: project.id },
        typeOf: client.factory.transactionType.Pay,
        transactionNumber: transactionNumber,
        agent: { typeOf: 'Person', name: 'サンプル決済者名称' },
        recipient: { typeOf: seller.typeOf, name: seller.name, id: seller.id },
        object: {
            typeOf: client.factory.service.paymentService.PaymentServiceType.MovieTicket,
            paymentMethod: {
                typeOf: paymentMethodType,
                amount: 0,
                additionalProperty: [],
                movieTickets: [
                    {
                        project: {
                            typeOf: "Project",
                            id: project.id
                        },
                        typeOf: paymentMethodType,
                        identifier: "AA6189998",
                        accessCode: "16931727027",
                        serviceType: "8200002",
                        serviceOutput: {
                            reservationFor: {
                                typeOf: "ScreeningEvent",
                                id: "7k9ayn1y9"
                            },
                            reservedTicket: {
                                ticketedSeat: {
                                    "seatSection": "Default",
                                    "seatNumber": "B-1",
                                    "seatRow": "",
                                    "seatingType": [],
                                    "typeOf": "Seat",
                                    "branchCode": "I-13",
                                    "additionalProperty": [],
                                    "offers": []
                                }
                            }
                        }
                    }
                ]
            }
        },
        expires: moment()
            .add(5, 'minutes')
            .toDate()
    });
    console.log('transaction started', transaction.id);

    // 確定
    await payService.confirm({
        transactionNumber: transactionNumber,
        potentialActions: {
            pay: {
                purpose: { orderNumber: `CIN${(new Date()).valueOf()}`, confirmationNumber: `CIN${(new Date()).valueOf()}` }
            }
        }
    });
    console.log('transaction confirmed');
}

async function wait(waitInMilliseconds) {
    return new Promise((resolve) => setTimeout(resolve, waitInMilliseconds));
}

main().then(() => {
    console.log('main processed.');
}).catch((err) => {
    console.error(err);
});

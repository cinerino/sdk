/**
 * 注文検索
 */
const moment = require('moment');
const auth = require('./authAsAdmin');
const client = require('../lib/index');

async function main() {
    const authClient = await auth.login();
    await authClient.refreshAccessToken();
    const loginTicket = authClient.verifyIdToken({});
    console.log('username is', loginTicket.getUsername());

    const orderService = new client.service.Order({
        endpoint: process.env.API_ENDPOINT,
        auth: authClient,
        project: { id: 'cinerino' }
    });

    const now = new Date();

    let i = 0;
    setInterval(
        async () => {
            i += 1;
            try {

                const { totalCount, data } = await orderService.search({
                    limit: 10,
                    page: 1,
                    orderDate: {
                        $gte: moment(now).add(-1, 'month').toDate(),
                        $lte: now,
                    },
                    // identifier: {
                    //     $in: [
                    //         { name: 'sampleOrderIdentifierName1', value: 'sampleOrderIdentifiervalue1' },
                    //         { name: 'sampleOrderIdentifierName2', value: 'sampleOrderIdentifiervalue2' }
                    //     ]
                    // },
                    // customer: {
                    //     typeOf: client.factory.personType.Person,
                    //     identifiers: [
                    //         { name: 'SampleName', value: 'SampleValue' }
                    //     ],
                    //     telephone: '3896$'
                    // },
                    paymentMethods: {
                        // typeOfs: [client.factory.paymentMethodType.Account],
                        // paymentMethodIds: ['30118000911']
                    },
                    acceptedOffers: {
                        itemOffered: {
                            // ids: ['118-181018-000018-0'],
                            reservationFor: {
                                // ids: ['xdflc2sjncbz279'],
                                // name: '',
                                // inSessionFrom: moment().add(1, 'days').toDate(),
                                // inSessionThrough: moment().add(4, 'days').toDate(),
                                // startFrom: moment().toDate(),
                                // startThrough: moment().add(3, 'days').toDate(),
                                location: {
                                    // branchCodes: ['90'],
                                },
                                superEvent: {
                                    // ids: ['405gzn58jnbd0wks'],
                                    location: {
                                        // branchCodes: ['002'],
                                    },
                                    workPerformed: {
                                        // identifiers: ['1622100'],
                                    }
                                }
                            }
                        }
                    }
                });
                console.log(i, totalCount, 'orders found');
                console.log(i, data.length, 'orders returned');
            } catch (error) {
                console.error(error);
            }
        },
        500
    );
}

main().then(() => {
    console.log('success!');
}).catch(console.error);

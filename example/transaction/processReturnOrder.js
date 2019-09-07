/**
 * 注文返品プロセス
 */
const moment = require('moment');
const auth = require('../authAsAdmin');
const client = require('../../lib/index');

async function main() {
    // 管理者として操作する場合はこちら
    const authClient = await auth.login();
    await authClient.refreshAccessToken();
    const loginTicket = authClient.verifyIdToken({});
    console.log('username is', loginTicket.getUsername());

    // const authClient = new client.auth.ClientCredentials({
    //     domain: process.env.TEST_AUTHORIZE_SERVER_DOMAIN,
    //     clientId: process.env.TEST_CLIENT_ID,
    //     clientSecret: process.env.TEST_CLIENT_SECRET,
    //     scopes: [],
    //     state: ''
    // });

    const returnOrderService = new client.service.txn.ReturnOrder({
        endpoint: process.env.API_ENDPOINT,
        auth: authClient
    });

    const transaction = await returnOrderService.start({
        expires: moment().add(30, 'minutes').toDate(),
        object: {
            order: {
                orderNumber: 'CIN8-6243267-0641966',
                customer: { telephone: '+819012345678' }
            }
        }
    });
    console.log('transaction started', transaction.id);

    const informUrl = 'https://cinerino-telemetry-api-development.azurewebsites.net/organizations/project/cinerino/lineNotify';

    console.log('confirming transaction...');
    await returnOrderService.confirm({
        id: transaction.id,
        potentialActions: {
            returnOrder: {
                potentialActions: {
                    cancelReservation: [
                        {
                            object: {
                                typeOf: client.factory.chevre.transactionType.Reserve,
                                id: '5d6e593c0470230012b80b53'
                            },
                            potentialActions: {
                                cancelReservation: {
                                    potentialActions: {
                                        informReservation: [
                                            { recipient: { url: informUrl } }
                                        ]
                                    }
                                }
                            }
                        }
                    ],
                    /**
                     * クレジットカード返金アクションについてカスタマイズする場合に指定
                     */
                    refundCreditCard: [{
                        object: {
                            object: [{
                                paymentMethod: { paymentMethodId: '' }
                            }]
                        },
                        potentialActions: {
                            sendEmailMessage: {
                                object: {
                                    emailTemplate: '| Sample emailTemplate #{order.orderNumber}'
                                }
                            }
                        }
                    }]
                }
            }
        }
    });
    console.log('transaction confirmed');
}

main().then(() => {
    console.log('success!');
}).catch(console.error);

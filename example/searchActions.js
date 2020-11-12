/**
 * アクション検索
 */
const util = require('util');
const auth = require('./authAsAdmin');
const client = require('../lib/index');

async function main() {
    const authClient = await auth.login();
    await authClient.refreshAccessToken();
    const loginTicket = authClient.verifyIdToken({});
    console.log('username is', loginTicket.getUsername());

    const actionService = new client.service.Action({
        endpoint: process.env.API_ENDPOINT,
        auth: authClient,
        project: { id: 'cinerino' }
    });
    const searchActionsResult = await actionService.search({
        limit: 10,
        object: {
            paymentMethod: { $eq: 'CreditCard' },
            // paymentMethodId: { $eq: 'CIN430484008542883' }
        }
    });
    console.log(searchActionsResult);
    console.log(searchActionsResult.data.map((a) => {
        return util.format(
            '@%s %s [%s] for [%s]',
            a.startDate,
            a.typeOf,
            a.object.typeOf,
            (a.purpose !== undefined) ? a.purpose.typeOf : '---'
        );
    }).join('\n'));
}

main().then(() => {
    console.log('success!');
}).catch(console.error);

/**
 * 注文アクション検索
 */
const util = require('util');
const auth = require('../auth');
const client = require('../../lib/index');

async function main() {
    const authClient = await auth.login();
    await authClient.refreshAccessToken();
    const loginTicket = authClient.verifyIdToken({});
    console.log('username is', loginTicket.getUsername());

    const personService = new client.service.Person({
        endpoint: process.env.API_ENDPOINT,
        auth: authClient
    });
    const actions = await personService.searchActionsOnOrder({
        personId: 'me',
        orderNumber: 'MO118-180913-000001',
        sort: { startDate: client.factory.sortType.Ascending }
    });
    console.log(actions);
    console.log(actions.map((a) => {
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

/**
 * ユーザープールのクライアント検索
 */
const auth = require('../authAsAdmin');
const client = require('../../lib/index');

async function main() {
    const authClient = await auth.login();
    await authClient.refreshAccessToken();
    const loginTicket = authClient.verifyIdToken({});
    console.log('username is', loginTicket.getUsername());

    const userPoolService = new client.service.UserPool({
        endpoint: process.env.API_ENDPOINT,
        auth: authClient
    });
    const { totalCount, data } = await userPoolService.searchClients({
        userPoolId: 'ap-northeast-1_ZVfZ7I3i8',
        limit: 20,
        page: 1,
        sort: {
            orderDate: client.factory.sortType.Descending
        }
    });
    console.log(data);
    console.log(totalCount, 'clients found');
    console.log(data.length, 'clients returned');

    const userPoolClient = await userPoolService.findClientById({
        clientId: data[0].ClientId,
        userPoolId: 'ap-northeast-1_ZVfZ7I3i8'
    });
    console.log(userPoolClient);
}

main().then(() => {
    console.log('success!');
}).catch(console.error);

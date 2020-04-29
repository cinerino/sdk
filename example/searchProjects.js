/**
 * プロジェクト検索
 */
const moment = require('moment');

const auth = require('./auth');
const client = require('../lib/index');

async function main() {
    const authClient = new client.auth.ClientCredentials({
        domain: process.env.TEST_AUTHORIZE_SERVER_DOMAIN,
        clientId: process.env.TEST_CLIENT_ID,
        clientSecret: process.env.TEST_CLIENT_SECRET,
        scopes: [],
        state: ''
    });

    const projectService = new client.service.Project({
        endpoint: process.env.API_ENDPOINT,
        auth: authClient
    });

    const { data } = await projectService.search({
    });
    console.log(data);
    console.log(data.length, 'projects returned');
}

main().then(() => {
    console.log('success!');
}).catch(console.error);

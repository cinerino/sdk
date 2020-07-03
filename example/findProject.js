const moment = require('moment');
const auth = require('./authAsAdmin');
const client = require('../lib/index');

async function main() {
    const authClient = await auth.login();
    await authClient.refreshAccessToken();
    const loginTicket = authClient.verifyIdToken({});
    console.log('username is', loginTicket.getUsername());

    const projectService = new client.service.Project({
        endpoint: process.env.API_ENDPOINT,
        auth: authClient
    });

    const project = await projectService.findById({ id: 'cinerino' });
    console.log('project found', project);

    // const searchProjectsResult = await projectService.search({});
    // console.log(searchProjectsResult.totalCount, 'project found', searchProjectsResult);
}

main().then(() => {
    console.log('success!');
}).catch(console.error);

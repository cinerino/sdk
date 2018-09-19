/**
 * タスク検索
 */
const moment = require('moment');
const auth = require('./authAsAdmin');
const client = require('../lib/index');

async function main() {
    const authClient = await auth.login();
    await authClient.refreshAccessToken();
    const loginTicket = authClient.verifyIdToken({});
    console.log('username is', loginTicket.getUsername());

    const taskService = new client.service.Task({
        endpoint: process.env.API_ENDPOINT,
        auth: authClient
    });

    const { totalCount, data } = await taskService.search({
        limit: 10,
        page: 1,
        // name: client.factory.taskName.ReturnPointAward,
        // statuses: [client.factory.taskStatus.Aborted],
        // runsFrom: moment().add(-1, 'day').toDate(),
        // runsThrough: moment().toDate(),
        // lastTriedFrom: moment().add(-1, 'day').toDate(),
        // lastTriedThrough: moment().toDate()
    });
    console.log(totalCount, 'tasks found');
    console.log(data.length, 'tasks returned');
}

main().then(() => {
    console.log('success!');
}).catch(console.error);

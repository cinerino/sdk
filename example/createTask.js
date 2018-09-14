/**
 * タスク作成サンプル
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
    let task = await taskService.create({
        name: client.factory.taskName.ImportScreeningEvents,
        status: client.factory.taskStatus.Ready,
        runsAt: new Date(),
        remainingNumberOfTries: 1,
        lastTriedAt: null,
        numberOfTried: 0,
        executionResults: [],
        data: {
            locationBranchCode: '118',
            importFrom: moment().toDate(),
            importThrough: moment().add(1, 'day').toDate()
        }
    });
    console.log('task created', task.id);

    task = await taskService.findById({ name: task.name, id: task.id });
    console.log('status is', task.status);
}

main().then(() => {
    console.log('success!');
}).catch(console.error);

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

    const applicationCategory = 'customer';
    // const memberType = client.factory.personType.Person;
    const memberType = client.factory.creativeWorkType.WebApplication;
    const memberId = '';
    const projectId = 'cinerino';

    const application = await projectService.fetch({
        uri: `/projects/${projectId}/iam/members`,
        method: 'POST',
        // tslint:disable-next-line:no-magic-numbers
        expectedStatusCodes: [201],
        body: {
            member: {
                applicationCategory: applicationCategory,
                typeOf: memberType,
                id: memberId,
                hasRole: [{ roleName: 'customer' }]
            },
        }
    })
        .then(async (response) => {
            return response.json();
        });
    console.log(application);

    // await projectService.fetch({
    //     uri: `/projects/${projectId}/iam/members/${memberId}`,
    //     method: 'DELETE',
    //     expectedStatusCodes: [204]
    // });
    // console.log('deleted');
}

main().then(() => {
    console.log('success!');
}).catch(console.error);

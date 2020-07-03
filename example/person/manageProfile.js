/**
 * プロフィール管理
 */
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
    let profile = await personService.getProfile({});
    console.log(profile);

    await personService.updateProfile({
        familyName: 'Cinerino',
        givenName: 'Taro',
        email: profile.email,
        telephone: profile.telephone,
        additionalProperty: [
            {
                name: 'address',
                value: 'Tokyo'
            },
            {
                name: 'custom:nationality',
                value: 'JP'
            }
        ]
    });
}

main().then(() => {
    console.log('success!');
}).catch(console.error);

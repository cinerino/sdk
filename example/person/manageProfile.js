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
    let profile = await personService.getProfile({ personId: 'me' });
    console.log(profile);

    await personService.updateProfile({
        personId: 'me',
        familyName: 'Cinerino',
        givenName: 'Taro',
        email: profile.email,
        telephone: '+819012345678'
    });
}

main().then(() => {
    console.log('success!');
}).catch(console.error);

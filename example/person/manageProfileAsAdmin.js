/**
 * プロフィール管理
 */
const auth = require('../authAsAdmin');
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

    const userId = '';

    let profile = await personService.getProfile({ id: userId });
    console.log(profile);

    await personService.updateProfile({
        id: userId,
        familyName: 'CinerinoCinerino',
        givenName: 'TaroTaro',
        email: profile.email,
        telephone: profile.telephone
    });
}

main().then(() => {
    console.log('success!');
}).catch(console.error);

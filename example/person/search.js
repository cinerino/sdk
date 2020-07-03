/**
 * 会員検索
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
    const personOwnershipInfoService = new client.service.person.OwnershipInfo({
        endpoint: process.env.API_ENDPOINT,
        auth: authClient
    });
    const { totalCount, data } = await personService.search({
        // username: 'yamazaki'
    });
    console.log(totalCount, 'people found');
    console.log(data.length, 'people returned');

    const person = await personService.findById({ id: data[0].id });
    console.log(person);

    const creditCards = await personOwnershipInfoService.searchCreditCards({ personId: person.id });
    console.log(creditCards);

    const searchCoinAccountsResult = await personOwnershipInfoService.search({
        personId: person.id,
        // limit: number;
        // page: number;
        ownedBy: {
            id: person.id
        },
        typeOfGood: {
            typeOf: client.factory.ownershipInfo.AccountGoodType.Account,
            accountType: client.factory.accountType.Coin
        }
    });
    console.log(searchCoinAccountsResult);
}

main().then(() => {
    console.log('success!');
}).catch(console.error);

const fs = require('fs');
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

    const eventService = new client.service.Event({
        endpoint: process.env.API_ENDPOINT,
        auth: authClient,
        project: { id: '' }
    });

    // const offers = await eventService.searchOffers({
    //     event: {
    //         id: '12116221020200121901710'
    //     }
    // });
    // console.log(offers);
    // console.log(offers[0].containsPlace);
    // console.log(offers.length, 'offers returned');

    const offers = await eventService.searchTicketOffers4COA({
        event: {
            id: '12116221020200121901710'
        },
        seller: { id: '59d20831e53ebc2b4e774467' },
        store: { id: process.env.TEST_CLIENT_ID }
    });
    console.log(offers);
    console.log(offers.length, 'offers returned');
    // fs.writeFileSync(`${__dirname}/offers.json`, JSON.stringify(offers, null, '    '));
}

main().then(() => {
    console.log('success!');
}).catch(console.error);

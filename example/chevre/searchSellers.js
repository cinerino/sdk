/**
 * 販売者検索サンプル
 */
const client = require('../../lib/');

async function main() {
    const authClient = new client.auth.ClientCredentials({
        domain: process.env.TEST_AUTHORIZE_SERVER_DOMAIN,
        clientId: process.env.TEST_CLIENT_ID,
        clientSecret: process.env.TEST_CLIENT_SECRET,
        scopes: []
    });

    const sellerService = new client.chevre.service.Seller({
        endpoint: process.env.TEST_API_ENDPOINT,
        auth: authClient,
        project: { id: 'cinerino' }
    });

    const { data } = await sellerService.search({
        // project: { id: { $eq: 'sskts-development' } },
        // additionalProperty: { $in: [{ name: 'branchCode', value: '120' }] },
        $projection: { name: 0, parentOrganization: 0, 'paymentAccepted.gmoInfo.shopPass': 0 }
    });
    console.log(data);
    console.log(data.length);
}

main().then(() => {
    console.log('main processed.');
}).catch((err) => {
    console.error(err);
});

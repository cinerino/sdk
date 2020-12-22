/**
 * 通貨転送取引プロセス
 */
const moment = require('moment');
// const auth = require('../authAsAdmin');
const auth = require('../auth');
const client = require('../../lib/index');

const projectId = 'cinerino';

const authClient = new client.auth.ClientCredentials({
    domain: process.env.TEST_AUTHORIZE_SERVER_DOMAIN,
    clientId: process.env.TEST_CLIENT_ID,
    clientSecret: process.env.TEST_CLIENT_SECRET,
    scopes: [],
    state: ''
});

async function main() {
    // const authClient = await auth.login();
    // await authClient.refreshAccessToken();
    // const loginTicket = authClient.verifyIdToken({});
    // console.log('username is', loginTicket.getUsername());

    const moneyTransferService = new client.service.txn.MoneyTransfer({
        endpoint: process.env.API_ENDPOINT,
        auth: authClient,
        project: { id: projectId }
    });
    const sellerService = new client.service.Seller({
        endpoint: process.env.API_ENDPOINT,
        auth: authClient,
        project: { id: projectId }
    });

    const amount = {
        value: 1,
        currency: 'JPY'
    };

    // let fromLocation = {
    //     typeOf: 'PrepaidPaymentCard',
    //     identifier: '10000052027',
    //     accessCode: '123'
    // };
    let fromLocation = {
        typeOf: 'Order',
        orderNumber: 'CIN6-4801622-4723084',
        confirmationNumber: '1741'
    };
    const toLocation = {
        typeOf: 'PrepaidPaymentCard',
        identifier: '864912122869377'
    };

    const agent = {
        typeOf: client.factory.personType.Person,
        name: 'Sample Agent Name'
    };
    const recipient = {
        typeOf: client.factory.personType.Person,
        name: 'Sample Recipient Name'
    };

    // 取引を開始するにあたって、販売者の指定が必要
    const searchSellersResult = await sellerService.search({});
    const seller = searchSellersResult.data.shift();

    // // 口座にコード発行
    // const { code } = await personOwnershipInfoService.authorize({
    //     ownershipInfoId: accountOwnershipInfo.id
    // });
    // // 口座所有権をトークン化
    // const { token } = await ownershipInfoService.getToken({ code });
    // fromLocation = token;

    // トークンを使用して口座オーソリアクション
    console.log('starting transaction...');
    const transaction = await moneyTransferService.start({
        typeOf: client.factory.transactionType.MoneyTransfer,
        agent: agent,
        recipient: recipient,
        seller: { typeOf: seller.typeOf, id: seller.id },
        object: {
            amount: amount,
            fromLocation: fromLocation,
            toLocation: toLocation,
            description: `サンプル取引 ${moment().toISOString()}`
        },
        expires: moment()
            .add(1, 'minutes')
            .toDate(),
    });
    console.log('transaction started', transaction.id);

    await moneyTransferService.setProfile({
        id: transaction.id,
        agent: {
            name: 'Sample Name',
            familyName: 'Sample Family Name',
            givenName: 'Sample Given Name',
            telephone: '+819012345678'
        }
    });
    await wait(1000);

    console.log('confirming transaction...');
    await moneyTransferService.confirm({
        id: transaction.id
    });
    console.log('transaction confirmed');
}

async function wait(waitInMilliseconds) {
    return new Promise((resolve) => setTimeout(resolve, waitInMilliseconds));
}

main().then(() => {
    console.log('success!');
}).catch(console.error);

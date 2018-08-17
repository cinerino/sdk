/**
 * コイン口座決済による注文プロセス
 */
const moment = require('moment');
const auth = require('../auth');
const client = require('../../lib/index');

async function main() {
    const authClient = await auth.login();
    await authClient.refreshAccessToken();
    const loginTicket = authClient.verifyIdToken({});
    console.log('username is', loginTicket.getUsername());

    const eventService = new client.service.Event({
        endpoint: process.env.API_ENDPOINT,
        auth: authClient
    });
    const organizationService = new client.service.Organization({
        endpoint: process.env.API_ENDPOINT,
        auth: authClient
    });
    const placeOrderService = new client.service.transaction.PlaceOrder({
        endpoint: process.env.API_ENDPOINT,
        auth: authClient
    });
    const personService = new client.service.Person({
        endpoint: process.env.API_ENDPOINT,
        auth: authClient
    });
    // const programMembershipService = new client.service.ProgramMembership({
    //     endpoint: process.env.API_ENDPOINT,
    //     auth: auth
    // });

    console.log('finding contact...');
    const contact = await personService.getContacts({ personId: 'me' });
    console.log('contact found');

    // 取引に使用するクレジットカードを決定する
    let creditCard;
    console.log('searching credit cards...');
    let creditCards = await personService.searchCreditCards({
        personId: 'me'
    });
    creditCards = creditCards.filter((c) => c.deleteFlag === '0');
    if (creditCards.length === 0) {
        console.log('adding credit card...');
        creditCard = await personService.addCreditCard({
            personId: 'me',
            creditCard: {
                cardNo: '4111111111111111',
                expire: '2020',
                holderName: 'AA BB'
            }
        });
        console.log('credit card added', creditCard.cardSeq);
    } else {
        creditCard = creditCards[0];
    }
    console.log('using credit card...', creditCard.cardSeq);

    // インセンティブ付与に使用するポイント口座を決定する
    let account;
    console.log('searching accounts...');
    let accounts = await personService.searchAccounts({
        personId: 'me',
        accountType: client.factory.accountType.Coin
    }).then((ownershipInfos) => ownershipInfos.map((o) => o.typeOfGood));
    accounts = accounts.filter((a) => a.status === client.factory.pecorino.accountStatusType.Opened);
    if (accounts.length === 0) {
        console.log('opening account...');
        account = await personService.openAccount({
            personId: 'me',
            name: loginTicket.getUsername(),
            accountType: client.factory.accountType.Coin
        }).then((ownershipInfo) => ownershipInfo.typeOfGood);
        console.log('account opened', account.accountNumber);
    } else {
        account = accounts[0];
    }
    console.log('your coin balance is', account.balance);

    // 販売劇場検索
    const sellers = await organizationService.searchMovieTheaters({});
    const seller = sellers[0];
    if (seller === undefined) {
        throw new Error('No seller');
    }

    // イベント検索
    const screeningEvents = await eventService.searchScreeningEvents({
        // superEventLocationIdentifiers: [seller.identifier],
        startFrom: moment().toDate(),
        // tslint:disable-next-line:no-magic-numbers
        startThrough: moment().add(1, 'week').toDate()
    });
    console.log(screeningEvents.length, 'events found');

    const availableEvents = screeningEvents;
    // const availableEvents = screeningEvents.filter(
    //     (event) => (event.offer.availability !== 0)
    // );
    if (availableEvents.length === 0) {
        throw new Error('No available events');
    }
    const screeningEvent = availableEvents[Math.floor(availableEvents.length * Math.random())];

    console.log('starting transaction...');
    const transaction = await placeOrderService.start({
        expires: moment().add(30, 'minutes').toDate(),
        sellerId: seller.id
    });
    console.log('transaction started', transaction.id);

    // 券種検索
    const ticketTypes = await eventService.searchScreeningEventTicketTypes({ eventId: screeningEvent.id });
    console.log(ticketTypes.length, 'ticket types found');

    // 空席検索
    const offers = await eventService.searchScreeningEventOffers({ eventId: screeningEvent.id });
    console.log(offers.length, 'offers found');
    const seatOffers = offers[0].containsPlace;
    console.log(seatOffers.length, 'seatOffers found');
    const availableSeatOffers = seatOffers.filter((o) => o.offers[0].availability === client.factory.chevre.itemAvailability.InStock);
    console.log(availableSeatOffers.length, 'availableSeatOffers found');
    if (availableSeatOffers.length <= 0) {
        throw new Error('No available seats');
    }

    // 券種をランダムに選択
    const selectedTicketType = ticketTypes[Math.floor(ticketTypes.length * Math.random())];
    console.log('ticket type selected', selectedTicketType.id);
    // 座席をランダムに選択
    const selectedScreeningRoomSection = offers[0].branchCode;
    console.log('screening room section selected', selectedScreeningRoomSection);
    console.log(selectedScreeningRoomSection);
    const selectedSeatOffer = availableSeatOffers[Math.floor(availableSeatOffers.length * Math.random())];
    console.log('seat selected', selectedSeatOffer.branchCode);

    await wait(5000);
    console.log('authorizing seat reservation...');
    const seatReservationAuth = await placeOrderService.authorizeSeatReservation({
        transactionId: transaction.id,
        event: {
            id: screeningEvent.id
        },
        tickets: [
            {
                ticketType: {
                    id: selectedTicketType.id
                },
                ticketedSeat: {
                    seatNumber: selectedSeatOffer.branchCode,
                    seatSection: selectedScreeningRoomSection
                }
            }
        ],
        notes: 'test from samples'
    });
    console.log('seat reservation authorized', seatReservationAuth.id);

    // クレジットカードオーソリアクション
    console.log('authorizing account payment...');
    const paymentAuth = await placeOrderService.authorizeAccountPayment({
        transactionId: transaction.id,
        amount: seatReservationAuth.result.price,
        accountType: client.factory.accountType.Coin,
        fromAccountNumber: account.accountNumber
    });
    console.log('account payment authorized', paymentAuth.id);

    // 購入者情報入力時間
    // tslint:disable-next-line:no-magic-numbers
    await wait(5000);

    console.log('setting customer contact...');
    await placeOrderService.setCustomerContact({
        transactionId: transaction.id,
        contact: {
            givenName: 'Taro',
            familyName: 'Motion',
            telephone: '+819012345678s',
            email: contact.email
        }
    });
    console.log('customer contact set');

    // 購入情報確認時間
    // tslint:disable-next-line:no-magic-numbers
    await wait(5000);

    // 取引を中止する場合はコチラ↓
    // console.log('取引を中止します...');
    // await placeOrderService.cancel({ transactionId: transaction.id });
    // console.log('取引を中止しました。');

    console.log('confirming transaction...');
    const result = await placeOrderService.confirm({
        transactionId: transaction.id,
        sendEmailMessage: false
    });
    console.log('transaction confirmed');
}

async function wait(waitInMilliseconds) {
    return new Promise((resolve) => setTimeout(resolve, waitInMilliseconds));
}

main().then(() => {
    console.log('success!');
}).catch(console.error);

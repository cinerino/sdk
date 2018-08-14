/**
 * クレジットカード決済による注文プロセス
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
    let pointAccount;
    console.log('searching pointAccounts...');
    let pointAccounts = await personService.searchPointAccounts({
        personId: 'me'
    });
    pointAccounts = pointAccounts.filter((a) => a.status === client.factory.pecorino.accountStatusType.Opened);
    if (pointAccounts.length === 0) {
        console.log('opening pointAccount...');
        pointAccount = await personService.openPointAccount({
            personId: 'me',
            name: loginTicket.getUsername()
        });
        console.log('pointAccount opened', pointAccount.accountNumber);
    } else {
        pointAccount = pointAccounts[0];
    }
    console.log('your point balance is', pointAccount.balance);

    // 販売劇場検索
    const sellers = await organizationService.searchMovieTheaters({});
    const seller = sellers[0];
    if (seller === undefined) {
        throw new Error('No seller');
    }

    /*****************************************************************
     * 会員としてポイントサービス特典を受けるためには、さらに会員プログラムへの登録処理が必要
     *****************************************************************/
    // console.log('所属会員プログラムを検索します...');
    // const programMembershipOwnershipInfos = await personService.searchOwnershipInfos({
    //     ownedBy: 'me',
    //     goodType: 'ProgramMembership'
    // });
    // console.log(programMembershipOwnershipInfos.length, '件の会員プログラムに所属しています。')
    // if (programMembershipOwnershipInfos.length === 0) {
    //     const programMemberships = await programMembershipService.search({});
    //     console.log(programMemberships.length, '件の会員プログラムが見つかりました。');

    //     console.log('会員プログラムに登録します...');
    //     const registerProgramMembershipTask = await personService.registerProgramMembership({
    //         personId: 'me',
    //         programMembershipId: programMemberships[0].id,
    //         offerIdentifier: programMemberships[0].offers[0].identifier,
    //         sellerType: seller.typeOf,
    //         sellerId: seller.id
    //     });
    //     console.log('会員プログラム登録タスクが作成されました。', registerProgramMembershipTask.id);
    // }

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
    console.log('authorizing credit card payment...');
    const creditCardPaymentAuth = await placeOrderService.authorizeCreditCardPayment({
        transactionId: transaction.id,
        amount: seatReservationAuth.result.price,
        // amount: ticketType.charge,
        orderId: moment().unix(),
        method: '1',
        creditCard: {
            memberId: 'me',
            cardSeq: creditCard.cardSeq
            // cardPass: ''
        }
        // creditCard: {
        //     cardNo: '4111111111111111',
        //     expire: '2412',
        //     holderName: 'AA BB'
        // }
    });
    console.log('credit card payment authorized', creditCardPaymentAuth.id);

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

    console.log('authorizing point award...');
    const pointAwardAuth = await placeOrderService.authorizePointAward({
        transactionId: transaction.id,
        amount: 1,
        toAccountNumber: pointAccount.accountNumber,
        notes: 'Order Incentive'
    });
    console.log('point award authorized', pointAwardAuth.id);

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

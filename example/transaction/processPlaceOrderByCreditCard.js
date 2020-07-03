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
    const sellerService = new client.service.Seller({
        endpoint: process.env.API_ENDPOINT,
        auth: authClient
    });
    const placeOrderService = new client.service.txn.PlaceOrder({
        endpoint: process.env.API_ENDPOINT,
        auth: authClient
    });
    const personService = new client.service.Person({
        endpoint: process.env.API_ENDPOINT,
        auth: authClient
    });
    const personOwnershipInfoService = new client.service.person.OwnershipInfo({
        endpoint: process.env.API_ENDPOINT,
        auth: authClient
    });

    console.log('finding profile...');
    const profile = await personService.getProfile({});
    console.log('profile found');

    // 取引に使用するクレジットカードを決定する
    let creditCard;
    console.log('searching credit cards...');
    let creditCards = await personOwnershipInfoService.searchCreditCards({
    });
    creditCards = creditCards.filter((c) => c.deleteFlag === '0');
    if (creditCards.length === 0) {
        console.log('adding credit card...');
        creditCard = await personService.addCreditCard({
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
    const searchAccountsResult = await personOwnershipInfoService.search({
        typeOfGood: {
            typeOf: client.factory.ownershipInfo.AccountGoodType.Account,
            accountType: client.factory.accountType.Point
        }
    });
    const pointAccounts = searchAccountsResult.data
        .map((o) => o.typeOfGood)
        .filter((a) => a.status === client.factory.pecorino.accountStatusType.Opened);
    if (pointAccounts.length === 0) {
        console.log('opening pointAccount...');
        pointAccount = await personOwnershipInfoService.openAccount({
            name: loginTicket.getUsername(),
            accountType: client.factory.accountType.Point
        }).then((ownershipInfo) => ownershipInfo.typeOfGood);
        console.log('pointAccount opened', pointAccount.accountNumber);
    } else {
        pointAccount = pointAccounts[0];
    }
    console.log('your point balance is', pointAccount.balance);

    // 販売劇場検索
    const searchSellersResult = await sellerService.search({});
    const seller = searchSellersResult.data[Math.floor(searchSellersResult.data.length * Math.random())];
    if (seller === undefined) {
        throw new Error('No seller');
    }
    console.log('ordering from seller...', seller.name.ja);

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
    //         programMembershipId: programMemberships[0].id,
    //         offerIdentifier: programMemberships[0].offers[0].identifier,
    //         sellerType: seller.typeOf,
    //         sellerId: seller.id
    //     });
    //     console.log('会員プログラム登録タスクが作成されました。', registerProgramMembershipTask.id);
    // }

    // イベント検索
    const searchScreeningEventsResult = await eventService.search({
        typeOf: client.factory.chevre.eventType.ScreeningEvent,
        // superEventLocationIdentifiers: [seller.identifier],
        inSessionFrom: moment().toDate(),
        inSessionThrough: moment().add(1, 'day').toDate(),
        superEvent: { locationBranchCodes: [seller.location.branchCode] }
    });
    console.log(searchScreeningEventsResult.totalCount, 'events found');

    const availableEvents = searchScreeningEventsResult.data;
    // const availableEvents = screeningEvents.filter(
    //     (event) => (event.offer.availability !== 0)
    // );
    if (availableEvents.length === 0) {
        throw new Error('No available events');
    }
    let screeningEvent = availableEvents[Math.floor(availableEvents.length * Math.random())];
    // screeningEvent = await eventService.findById({ id: '7iribo4jol8uwae' });

    // WAITER許可証
    // const passportToken = await request.post(
    //     `${process.env.WAITER_ENDPOINT}/passports`,
    //     {
    //         body: {
    //             scope: `Transaction:PlaceOrder:${seller.id}`
    //         },
    //         json: true
    //     }
    // ).then((body) => body.token).catch((err) => {
    //     throw new Error(err.message);
    // });
    // console.log('passportToken published', passportToken);

    console.log('starting transaction...');
    const transaction = await placeOrderService.start({
        expires: moment().add(10, 'minutes').toDate(),
        agent: {
            identifier: [
                {
                    name: 'SampleName',
                    value: 'SampleValue'
                }
            ]
        },
        seller: {
            typeOf: seller.typeOf,
            id: seller.id
        },
        object: {
            // passport: { token: passportToken }
        }
    });
    console.log('transaction started', transaction.id);

    // 券種検索
    let ticketOffers = await eventService.searchTicketOffers({
        event: { id: screeningEvent.id },
        seller: { typeOf: seller.typeOf, id: seller.id },
        store: { id: process.env.TEST_CLIENT_ID },
    });
    console.log('チケットオファーは以下の通りです')
    console.log(ticketOffers.map((o) => {
        const unitPriceSpec = o.priceSpecification.priceComponent
            .filter((s) => s.typeOf === client.factory.chevre.priceSpecificationType.UnitPriceSpecification)
            .shift();
        const videoFormatCharge = o.priceSpecification.priceComponent
            .filter((s) => s.typeOf === client.factory.chevre.priceSpecificationType.VideoFormatChargeSpecification)
            .map((s) => `+${s.appliesToVideoFormat}チャージ:${s.price} ${s.priceCurrency}`).join(' ')
        const soundFormatCharge = o.priceSpecification.priceComponent
            .filter((s) => s.typeOf === client.factory.chevre.priceSpecificationType.SoundFormatChargeSpecification)
            .map((s) => `+${s.appliesToSoundFormat}チャージ:${s.price} ${s.priceCurrency}`).join(' ')
        return `${o.id} ${o.name.ja} ${unitPriceSpec.price}/${unitPriceSpec.referenceQuantity.value} ${o.priceCurrency} ${videoFormatCharge} ${soundFormatCharge}`
    }).join('\n'));

    // 空席検索
    const offers = await eventService.searchOffers({ event: screeningEvent });
    console.log(offers.length, 'offers found');
    const seatOffers = offers[0].containsPlace;
    console.log(seatOffers.length, 'seatOffers found');
    const availableSeatOffers = seatOffers.filter((o) => o.offers[0].availability === client.factory.chevre.itemAvailability.InStock);
    console.log(availableSeatOffers.length, 'availableSeatOffers found');
    if (availableSeatOffers.length <= 0) {
        throw new Error('No available seats');
    }

    // ムビチケ以外のオファーを選択
    ticketOffers = ticketOffers.filter((offer) => {
        const movieTicketTypeChargeSpecification = offer.priceSpecification.priceComponent.find(
            (component) => component.typeOf === client.factory.chevre.priceSpecificationType.MovieTicketTypeChargeSpecification
        );
        return movieTicketTypeChargeSpecification === undefined;
    });
    const selectedTicketOffer = ticketOffers[Math.floor(ticketOffers.length * Math.random())];
    console.log('ticket offer selected', selectedTicketOffer.id);

    // 座席をランダムに選択
    const selectedScreeningRoomSection = offers[0].branchCode;
    console.log('screening room section selected', selectedScreeningRoomSection);
    console.log(selectedScreeningRoomSection);
    const selectedSeatOffers = availableSeatOffers.slice(0, 2);
    console.log('seat selected', selectedSeatOffers.map((o) => o.branchCode).join(','));

    await wait(5000);
    console.log('authorizing seat reservation...');
    let seatReservationAuth = await placeOrderService.authorizeSeatReservation({
        object: {
            event: {
                id: screeningEvent.id
            },
            acceptedOffer: selectedSeatOffers.map((selectedSeatOffer) => {
                return {
                    id: selectedTicketOffer.id,
                    ticketedSeat: {
                        seatNumber: selectedSeatOffer.branchCode,
                        seatSection: selectedScreeningRoomSection
                    }
                };
            }),
            notes: 'test from samples'
        },
        purpose: transaction
    });
    console.log('seat reservation authorized', seatReservationAuth.id);

    // await wait(5000);
    // console.log('voiding seat reservation auth...');
    // await placeOrderService.voidSeatReservation({ transactionId: transaction.id, actionId: seatReservationAuth.id });
    // console.log('seat reservation auth voided');

    // 金額計算
    if (seatReservationAuth.result === undefined) {
        throw new Error('座席予約承認結果は必ず存在します');
    }
    let amount = seatReservationAuth.result.price;
    console.log('金額は', amount);

    // クレジットカードオーソリアクション
    console.log('authorizing credit card payment...');
    let creditCardPaymentAuth = await placeOrderService.authorizeCreditCardPayment({
        object: {
            typeOf: client.factory.paymentMethodType.CreditCard,
            amount: amount,
            method: '1',
            payType: '0',
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
        },
        purpose: transaction
    });
    console.log('credit card payment authorized', creditCardPaymentAuth.id);

    await wait(5000);

    console.log('voiding credit card auth...');
    await placeOrderService.voidPayment(creditCardPaymentAuth);
    console.log('credit card auth voided');

    console.log('authorizing credit card payment...');
    creditCardPaymentAuth = await placeOrderService.authorizeCreditCardPayment({
        object: {
            typeOf: client.factory.paymentMethodType.CreditCard,
            amount: amount,
            method: '1',
            payType: '0',
            creditCard: {
                memberId: 'me',
                cardSeq: creditCard.cardSeq
            }
        },
        purpose: transaction
    });
    console.log('credit card payment authorized', creditCardPaymentAuth.id);

    // 購入者情報入力時間
    // tslint:disable-next-line:no-magic-numbers
    await wait(5000);

    console.log('setting customer profile...');
    await placeOrderService.setProfile({
        id: transaction.id,
        agent: {
            givenName: 'Taro',
            familyName: 'Motion',
            telephone: '+819012345678',
            email: profile.email
        }
    });
    console.log('customer profile set');

    console.log('authorizing point award...');
    const pointAwardAuth = await placeOrderService.authorizePointAward({
        object: {
            notes: 'Order Incentive'
        },
        purpose: transaction
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
    let result = await placeOrderService.confirm({
        id: transaction.id,
        sendEmailMessage: true,
        emailTemplate: `
| #{order.customer.familyName} #{order.customer.givenName} 様
| この度は、#{order.seller.name}のオンラインチケットサービスにてご購入頂き、誠にありがとうございます。お客様がご購入されましたチケットの情報は下記の通りです。
| 
| [注文番号]
| #{order.orderNumber}
| 
| [注文日時]
| #{order.orderDate}
| 
| [確認番号]
| #{order.confirmationNumber}
| 
| [合計]
| ￥#{order.price}
| 
| お問い合わせはこちら
| #{order.seller.name}
| TEL：#{order.seller.telephone}
`
    });
    console.log('transaction confirmed', result.order.orderNumber);
    // 何度確定をコールしても冪等
    console.log('confirming transaction...');
    result = await placeOrderService.confirm({
        id: transaction.id,
        sendEmailMessage: true
    });
    console.log('transaction confirmed', result.order.orderNumber);
    // 何度確定をコールしても冪等
    console.log('confirming transaction...');
    result = await placeOrderService.confirm({
        id: transaction.id,
        sendEmailMessage: true
    });
    console.log('transaction confirmed', result.order.orderNumber);
}

async function wait(waitInMilliseconds) {
    return new Promise((resolve) => setTimeout(resolve, waitInMilliseconds));
}

main().then(() => {
    console.log('success!');
}).catch(console.error);

exports.main = main;
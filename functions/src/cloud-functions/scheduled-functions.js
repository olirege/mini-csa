const functions = require("firebase-functions");
const utils = require("../utils/utils.js");
const {db, globals} = require("../init.js");
const admin = require("firebase-admin");
const xmls = require("../utils/xmls.js");
const MERCHANT_ID = globals.MERCHANT_ID;
const CURRENCY = globals.CURRENCY;
const PAYER_REF = globals.PAYER_REF;
const SS = globals.SS;
const ACCOUNT = globals.ACCOUNT;
const PMT_REF = globals.PMT_REF;
const todayMidnight = globals.todayMidnight;
const tomorrowMidnight = globals.tomorrowMidnight;
const dayAfterTomorrowMidnight = globals.dayAfterTomorrowMidnight;
const in4daysAtMidnight = globals.in4daysAtMidnight;
const in7daysAtMidnight = globals.in7daysAtMidnight;
const timestampFromDate = admin.firestore.Timestamp.fromDate(todayMidnight);
const timestampFromTomorrow = admin.firestore.Timestamp.fromDate(tomorrowMidnight);
const timestampFromDayAfterTomorrow = admin.firestore.Timestamp.fromDate(dayAfterTomorrowMidnight);
const timezone = globals.timezone;

exports.scheduledCartReminders = functions.pubsub.schedule("0 0 * * *")
    .timeZone(timezone)
    .onRun((context) => {
        const message = {
            subject: "Your cart is scheduled to close tomorrow",
            text: "Your cart is scheduled to close tomorrow",
            html: "Your cart is scheduled to close tomorrow",
        };
        const cartsSheduledForTomorrowCheckoutDocRef = db.collection("carts")
            .where("cartStatus", "in", ["active-with-items", "active-no-items"])
            .where("closesOn", ">=", timestampFromTomorrow)
            .where("closesOn", "<", timestampFromDayAfterTomorrow);
        return db.runTransaction((transaction) => {
            return transaction.get(cartsSheduledForTomorrowCheckoutDocRef).then((querySnapshot) => {
                querySnapshot.forEach((cart) => {
                    utils.sendEmailToCustomer(cart.id, message);
                });
            });
        });
    });
exports.scheduledCloseEmptyCartsDueToday = functions.pubsub.schedule("0 0 * * *")
    .timeZone(timezone)
    .onRun((context) => {
        const newCart = {
            items: [],
            scannedItems: [],
            cartStatus: "disabled",
            createdAt: new Date(),
            opensOn: in4daysAtMidnight,
            closesOn: in7daysAtMidnight,
        };
        const emptyCartsSheduledForTodayCheckoutDocRef = db.collection("carts")
            .where("cartStatus", "==", "active-no-items")
            .where("closesOn", ">=", timestampFromDate)
            .where("closesOn", "<", timestampFromTomorrow);
            return db.runTransaction((transaction) => {
                return transaction.get(emptyCartsSheduledForTodayCheckoutDocRef).then((querySnapshot) => {
                    querySnapshot.forEach((doc) => {
                        functions.logger.debug("Scheduled close empty carts due today", {docId: doc.id});
                        const olderCart = doc.data();
                        const ORDER_ID = utils.createOid();
                        transaction.update(doc.ref, newCart);
                        const oldcartOrdersSubcollectionRef = db.collection("oldcarts").doc(doc.id).collection("orders");
                        const order = {
                            cartStatus: "closed",
                            total: 0,
                            createdAt: olderCart.createdAt,
                            openedOn: olderCart.opensOn,
                            closedOn: olderCart.closesOn,
                        };
                        transaction.set(oldcartOrdersSubcollectionRef.doc(ORDER_ID), order);
                    });
                });
            }).catch((error) => {
                functions.logger.debug(error);
            }).then(() => {
                functions.logger.debug("Empty carts closed");
        });
    });
exports.scheduledCartCheckouts = functions.pubsub.schedule("0 0 * * *")
    .timeZone(timezone)
    .onRun(() => {
        const newCart = {
            items: [],
            cartStatus: "disabled",
            createdAt: new Date(),
            opensOn: in4daysAtMidnight,
            closesOn: in7daysAtMidnight,
        };
        const cartsSheduledForTodayCheckoutDocRef = db.collection("carts")
            .where("cartStatus", "==", "active-with-items")
            .where("closesOn", ">=", timestampFromDate)
            .where("closesOn", "<", timestampFromTomorrow);
        functions.logger.debug("Scheduled cart checkouts", {timestampFromDate, timestampFromTomorrow});
        return db.runTransaction((transaction) => {
            return transaction.get(cartsSheduledForTodayCheckoutDocRef).then((querySnapshot) => {
                querySnapshot.forEach((cart) => {
                    const olderCart = cart.data();
                    functions.logger.debug("Scheduled cart checkout", {docId: cart.id});
                    const ORDER_ID = utils.createOid();
                    const AMOUNT = utils.cartTotal(olderCart.items);
                    transaction.update(cart.ref, newCart);
                    const oldcartOrdersSubcollectionRef = db.collection("oldcarts").doc(cart.id).collection("orders");
                    const order = {
                        cartStatus: "checked-out",
                        checkoutTotal: AMOUNT,
                        createdAt: olderCart.createdAt,
                        openedOn: olderCart.opensOn,
                        closedOn: olderCart.closesOn,
                        items: olderCart.items,
                        scannedItems: [],
                    };
                    transaction.set(oldcartOrdersSubcollectionRef.doc(ORDER_ID), order);
                    functions.logger.debug("Scheduled cart checkout", {docId: cart.id, orderId: ORDER_ID});
                    const TIMESTAMP = utils.timestampToYYYYMMDDHHMMSS();
                    const SHA1HASH = utils.createCHARGESHA1(TIMESTAMP, MERCHANT_ID, ORDER_ID, AMOUNT, CURRENCY, PAYER_REF, SS); // could be PMT_REF instead of PAYER_REF
                    const chargeForm = xmls.chargeForm(TIMESTAMP, MERCHANT_ID, ACCOUNT, ORDER_ID, AMOUNT, CURRENCY, PMT_REF, PAYER_REF, SHA1HASH);
                    utils.chargeUser(ORDER_ID, cart.id, chargeForm);
                });
            });
        });
  });
exports.scheduledActiveCartOnOpenDate = functions.pubsub.schedule("0 0 * * *")
    .timeZone(timezone)
    .onRun((context) => {
        const cartsScheduledToOpenTodayDocRef = db.collection("carts")
            .where("cartStatus", "==", "disabled")
            .where("opensOn", ">=", timestampFromDate)
            .where("opensOn", "<", timestampFromTomorrow);
        return cartsScheduledToOpenTodayDocRef.get().then((querySnapshot) => {
                if (querySnapshot.empty) {
                    functions.logger.debug("No carts scheduled to open today");
                } else {
                querySnapshot.forEach((doc) => {
                    db.doc(`carts/${doc.id}`)
                        .set({
                            cartStatus: "active-no-items",
                        }, {merge: true});
                    const message = {
                        subject: "Your cart is now open",
                        html: "<p>Your cart is now open. You can add items to your cart by clicking the 'Add to Cart' button on the product page.</p>",
                    };
                    utils.sendEmailToCustomer(doc.id, message);
                    }
                );
            }
        }).catch((error) => {
            functions.logger.debug(error);
        }).then(() => {
            functions.logger.debug("Scheduled carts opened");
    });
});

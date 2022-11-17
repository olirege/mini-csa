const functions = require("firebase-functions");
const createUserApp = require("./src/create-user.js");
const utils = require("./src/utils/utils.js");
const db = require("./src/init.js").db;
const admin = require("firebase-admin");
const axios = require("axios");
const CryptoJS = require("crypto-js");
const DOMParser = require("xmldom").DOMParser;

function sendEmailToCustomer(cid, message) {
    db.collection("users").doc(cid).get().then((doc) => {
        if (doc.exists) {
            if (doc.data().recieveEmailReminder || doc.data().recieveEmailReminder === undefined || message.subject === "Order Confirmation") {
                return doc.data().email;
            } else {
                return null;
            }
        } else {
            return null;
        }
    }).then((email) => {
        if (email) {
        db.collection("mail")
        .add({
            to: email,
            message: message,
        })
        .then(() => console.log("Queued email for delivery!"));
        }
    });
}
function cartTotal(cart) {
    let total = 0;
    cart.forEach((p) => {
        total += p.price * p.qty;
    });
    return total;
}

function createSHA1(ts, oid, amt, pref) {
    const sha1 = CryptoJS.SHA1(
      `${ts}.${"dev944773432681974498"}.${oid}.${amt}.${"USD"}.${pref}`);
    const shaSS = CryptoJS.SHA1(sha1.toString(CryptoJS.enc.Hex) + "." + "B4Kxk3Ven1");
    const shaSSHex = shaSS.toString(CryptoJS.enc.Hex);
    return shaSSHex;
}

// function timestampToYYYYMMDDHHMMSS() {
//     const date = new Date();
//     const year = date.getFullYear();
//     const month = date.getMonth() + 1;
//     const day = date.getDate();
//     const hour = date.getHours();
//     const minute = date.getMinutes();
//     const second = date.getSeconds();
//     return `${year}${month < 10 ? "0" + month : month}${
//         day < 10 ? "0" + day : day
//     }${hour < 10 ? "0" + hour : hour}${minute < 10 ? "0" + minute : minute}${
//         second < 10 ? "0" + second : second
//     }`;
// }

function chargeUser(oid, amount, cid) {
    const TIMESTAMP = utils.timestampToYYYYMMDDHHMMSS();
    const pref = "376a2598-412d-4805-9f47-c177d5605853";
    const SHA1HASH = createSHA1(TIMESTAMP, oid, amount, pref);
    const data = `<?xml version="1.0" encoding="UTF-8"?>
                <request type="receipt-in" timestamp="${TIMESTAMP}">
                <merchantid>dev944773432681974498</merchantid>
                <account>internet</account>
                <channel>ECOM</channel>
                <orderid>${oid}</orderid>
                <amount currency="USD">${amount}</amount>
                <autosettle flag="1"/>
                <payerref>${pref}</payerref>
                <paymentmethod>88f578b7-f854-4ffc-b15e-163b05dc5f96</paymentmethod>
                <sha1hash>${SHA1HASH}</sha1hash>
                </request>`;
    axios({
        method: "post",
        url: "https://api.sandbox.realexpayments.com/epage-remote.cgi",
        data: data,
        headers: {
            "Content-Type": "text/xml;charset=UTF-8",
        },
    }).then((xmlResponse) => {
        const doc = new DOMParser().parseFromString(xmlResponse.data);
        const result = doc.getElementsByTagName("result")[0].childNodes[0].nodeValue;
        if (result === "00") {
            const message = {
                subject: "Order Confirmation",
                html: `<p>Thank you for your order. Your order number is ${oid}.</p>`,
            };
            sendEmailToCustomer(cid, message);
        } else {
            const message = {
                subject: "Order Failed",
                html: "<p>Sorry, your order failed.</p>",
            };
            sendEmailToCustomer(cid, message);
        }
    }).catch((error) => {
        functions.logger.debug(error);
    });
}
exports.createUser = functions.https
    .onRequest(createUserApp);

exports.onUserCreationCreateCart = functions.firestore
    .document("users/{userId}")
    .onCreate((snap, context) => {
        const userId = context.params.userId;
        db.doc(`carts/${userId}`)
        .set({
          items: [],
          createdAt: new Date().toISOString(),
        });
        db.doc(`oldcarts/${userId}`)
        .set({
            history: [],
            createdAt: new Date().toISOString(),
        });
    });
exports.scheduledActiveCartOnOpenDate = functions.pubsub.schedule("0 0 * * *")
    .timeZone("Canada/Eastern")
    .onRun((context) => {
        const todayMidnight = new Date();
        todayMidnight.setHours(5, 0, 0, 0);
        const tomorrowMidnight = new Date();
        tomorrowMidnight.setDate(tomorrowMidnight.getDate() + 1);
        tomorrowMidnight.setHours(5, 0, 0, 0);
        const timestampFromDate = admin.firestore.Timestamp.fromDate(todayMidnight);
        const timestampFromTomorrow = admin.firestore.Timestamp.fromDate(tomorrowMidnight);
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
                    sendEmailToCustomer(doc.id, message);
                    }
                );
            }
        }).catch((error) => {
            functions.logger.debug(error);
        }).then(() => {
            functions.logger.debug("Scheduled carts opened");
    });
});
exports.scheduledCartCheckouts = functions.pubsub.schedule("0 0 * * *")
    .timeZone("Canada/Eastern") // Users can choose timezone - default is America/Los_Angeles
    .onRun(() => {
        const todayMidnight = new Date();
        todayMidnight.setHours(5, 0, 0, 0);
        const tomorrowMidnight = new Date(todayMidnight);
        tomorrowMidnight.setDate(tomorrowMidnight.getDate() + 1);
        const in4daysAtMidnight = new Date();
        in4daysAtMidnight.setDate(in4daysAtMidnight.getDate() + 4);
        in4daysAtMidnight.setHours(5, 0, 0, 0);
        const in7daysAtMidnight = new Date();
        in7daysAtMidnight.setDate(in7daysAtMidnight.getDate() + 7);
        in7daysAtMidnight.setHours(5, 0, 0, 0);
        const newCart = {
            items: [],
            cartStatus: "disabled",
            createdAt: new Date(),
            opensOn: in4daysAtMidnight,
            closesOn: in7daysAtMidnight,
        };
        const timestampFromDate = admin.firestore.Timestamp.fromDate(todayMidnight);
        const timestampFromTomorrow = admin.firestore.Timestamp.fromDate(tomorrowMidnight);
        const cartsSheduledForTodayCheckoutDocRef = db.collection("carts")
            .where("cartStatus", "==", "active-with-items")
            .where("closesOn", ">=", timestampFromDate)
            .where("closesOn", "<", timestampFromTomorrow);
        return db.runTransaction((transaction) => {
            return transaction.get(cartsSheduledForTodayCheckoutDocRef).then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    const olderCart = doc.data();
                    // const olderStamps = {
                    //     createdAt: olderCart.createdAt,
                    //     openedOn: olderCart.opensOn,
                    //     closedOn: olderCart.closesOn,
                    // };
                    const oid = Math.random().toString(36).substring(2, 15).toUpperCase();
                    const total = cartTotal(olderCart.items);
                    transaction.update(doc.ref, {
                        newCart,
                        // // history: admin.firestore.FieldValue.arrayUnion({
                        // //     oid: oid,
                        // //     createdAt: olderStamps.createdAt,
                        // //     openedOn: olderStamps.openedOn,
                        // //     closedOn: olderStamps.closedOn,
                        // //     items: olderCart.items,
                        // //     total: total,
                        // }),
                    });
                    chargeUser(oid, total, doc.id);
                });
            });
        });
  });
exports.scheduledCloseEmptyCartsDueToday = functions.pubsub.schedule("0 0 * * *")
    .timeZone("Canada/Eastern")
    .onRun((context) => {
        const todayMidnight = new Date();
        todayMidnight.setHours(5, 0, 0, 0);
        const tomorrowMidnight = new Date(todayMidnight);
        tomorrowMidnight.setDate(tomorrowMidnight.getDate() + 1);
        const in4daysAtMidnight = new Date();
        in4daysAtMidnight.setDate(in4daysAtMidnight.getDate() + 4);
        in4daysAtMidnight.setHours(5, 0, 0, 0);
        const in7daysAtMidnight = new Date();
        in7daysAtMidnight.setDate(in7daysAtMidnight.getDate() + 7);
        in7daysAtMidnight.setHours(5, 0, 0, 0);
        const newCart = {
            items: [],
            cartStatus: "disabled",
            createdAt: new Date(),
            opensOn: in4daysAtMidnight,
            closesOn: in7daysAtMidnight,
        };
        const timestampFromDate = admin.firestore.Timestamp.fromDate(todayMidnight);
        const timestampFromTomorrow = admin.firestore.Timestamp.fromDate(tomorrowMidnight);
        const emptyCartsSheduledForTodayCheckoutDocRef = db.collection("carts")
            .where("cartStatus", "==", "active-no-items")
            .where("closesOn", ">=", timestampFromDate)
            .where("closesOn", "<", timestampFromTomorrow);
            return db.runTransaction((transaction) => {
                return transaction.get(emptyCartsSheduledForTodayCheckoutDocRef).then((querySnapshot) => {
                    querySnapshot.forEach((doc) => {
                        // const olderCart = doc.data();
                        // const olderStamps = {
                        //     createdAt: olderCart.createdAt,
                        //     openedOn: olderCart.opensOn,
                        //     closedOn: olderCart.closesOn,
                        // };
                        // const oid = Math.random().toString(36).substring(2, 15).toUpperCase();
                        transaction.update(doc.ref, {
                            newCart,
                            // history: admin.firestore.FieldValue.arrayUnion({
                            //     oid: oid,
                            //     createdAt: olderStamps.createdAt,
                            //     openedOn: olderStamps.openedOn,
                            //     closedOn: olderStamps.closedOn,
                            //     items: olderCart.items,
                            //     total: 0,
                            // }),
                        });
                    });
                });
            }).catch((error) => {
            functions.logger.debug(error);
        }).then(() => {
            functions.logger.debug("Empty carts closed");
    });
});
exports.scheduledCartReminders = functions.pubsub.schedule("0 0 * * *")
    .timeZone("Canada/Eastern")
    .onRun((context) => {
        const tomorrowMidnight = new Date();
        tomorrowMidnight.setDate(tomorrowMidnight.getDate() + 1);
        tomorrowMidnight.setHours(5, 0, 0, 0);
        const timestampFromTomorrow = admin.firestore.Timestamp.fromDate(tomorrowMidnight);
        const dayAfterTomorrowMidnight = new Date();
        dayAfterTomorrowMidnight.setDate(dayAfterTomorrowMidnight.getDate() + 2);
        dayAfterTomorrowMidnight.setHours(5, 0, 0, 0);
        const timestampFromDayAfterTomorrow = admin.firestore.Timestamp.fromDate(dayAfterTomorrowMidnight);
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
                querySnapshot.forEach((doc) => {
                    sendEmailToCustomer(doc.id, message);
                });
            });
        });
    });


const CryptoJS = require("crypto-js");
const db = require("../init.js").db;
const axios = require("axios");
const DOMParser = require("xmldom").DOMParser;
const functions = require("firebase-functions");
exports.timestampToYYYYMMDDHHMMSS = function() {
        const date = new Date();
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const hour = date.getHours();
        const minute = date.getMinutes();
        const second = date.getSeconds();
        return `${year}${month < 10 ? "0" + month : month}${
            day < 10 ? "0" + day : day
        }${hour < 10 ? "0" + hour : hour}${minute < 10 ? "0" + minute : minute}${
            second < 10 ? "0" + second : second
        }`;
    };
exports.createADDSHA1 = function(TIMESTAMP, ORDER_ID, MERCHANT_ID, AMOUNT, CURRENCY, PAYER_REF, PMT_REF, SS) {
    const sha1 = CryptoJS.SHA1(
        `${TIMESTAMP}.${MERCHANT_ID}.${ORDER_ID}.${AMOUNT}.${CURRENCY}.${PAYER_REF}.${PMT_REF}`);
    const shaSS = CryptoJS.SHA1(sha1.toString(CryptoJS.enc.Hex) + "." + SS);
    const shaSSHex = shaSS.toString(CryptoJS.enc.Hex);
    return shaSSHex;
    };
exports.createDELETESHA1 = function(TIMESTAMP, MERCHANT_ID, PAYER_REF, PMT_REF, SS) {
    const sha1 = CryptoJS.SHA1(
        `${TIMESTAMP}.${MERCHANT_ID}.${PAYER_REF}.${PMT_REF}`);
    const shaSS = CryptoJS.SHA1(sha1.toString(CryptoJS.enc.Hex) + "." + SS);
    const shaSSHex = shaSS.toString(CryptoJS.enc.Hex);
    return shaSSHex;
    };
exports.createOid = function() {
    return Math.random().toString(36).substring(2, 15).toUpperCase();
    };
exports.createCHARGESHA1 = function(TIMESTAMP, MERCHANT_ID, ORDER_ID, AMOUNT, CURRENCY, PAYER_REF, SS) {
    const sha1 = CryptoJS.SHA1(
        `${TIMESTAMP}.${MERCHANT_ID}.${ORDER_ID}.${AMOUNT}.${CURRENCY}.${PAYER_REF}`);
    const shaSS = CryptoJS.SHA1(sha1.toString(CryptoJS.enc.Hex) + "." + SS);
    const shaSSHex = shaSS.toString(CryptoJS.enc.Hex);
    return shaSSHex;
    };

exports.chargeUser = function(ORDER_ID, cid, xmls) {
    // const SHA1HASH = utils.createCHARGESHA1(TIMESTAMP, MERCHANT_ID, ORDER_ID, AMOUNT, CURRENCY, PAYER_REF, SS); // could be PMT_REF instead of PAYER_REF
    // const data = xmls.chargeForm(TIMESTAMP, MERCHANT_ID, ACCOUNT, ORDER_ID, AMOUNT, CURRENCY, PMT_REF, PAYER_REF, SHA1HASH);
    // const data = `<?xml version="1.0" encoding="UTF-8"?>
    //             <request type="receipt-in" timestamp="${TIMESTAMP}">
    //             <merchantid>dev944773432681974498</merchantid>
    //             <account>internet</account>
    //             <channel>ECOM</channel>
    //             <orderid>${oid}</orderid>
    //             <amount currency="USD">${amount}</amount>
    //             <autosettle flag="1"/>
    //             <payerref>${pref}</payerref>
    //             <paymentmethod>88f578b7-f854-4ffc-b15e-163b05dc5f96</paymentmethod>
    //             <sha1hash>${SHA1HASH}</sha1hash>
    //             </request>`;
    axios({
        method: "post",
        url: "https://api.sandbox.realexpayments.com/epage-remote.cgi",
        data: xmls,
        headers: {
            "Content-Type": "text/xml;charset=UTF-8",
        },
    }).then((xmlResponse) => {
        const doc = new DOMParser().parseFromString(xmlResponse.data);
        const result = doc.getElementsByTagName("result")[0].childNodes[0].nodeValue;
        if (result === "00") {
            const message = {
                subject: "Order Confirmation",
                html: `<p>Thank you for your order. Your order number is ${ORDER_ID}.</p>`,
            };
            exports.sendEmailToCustomer(cid, message);
        } else {
            const message = {
                subject: "Order Failed",
                html: "<p>Sorry, your order failed.</p>",
            };
            exports.sendEmailToCustomer(cid, message);
        }
    }).catch((error) => {
        functions.logger.debug(error);
    });
};
exports.cartTotal = function(cart) {
    let total = 0;
    cart.forEach((p) => {
        total += p.price * p.qty;
    });
    return total;
};
exports.sendEmailToCustomer = function(cid, message) {
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
};
// exports.convertUnitIntoGrams = function(unit, weight) {
//     // const conversionFactors = {
//     //     volumes: {
//     //       "milliliters": 1,
//     //       "liters": 1000,
//     //       "teaspoons": 4.92892,
//     //       "tablespoons": 14.7868,
//     //       "cups": 236.588,
//     //       "pints": 473.176,
//     //       "quarts": 946.353,
//     //       "gallons": 3785.41
//     //     },
//     //     weights: {
//     //       "ounces": 29.5735,
//     //       "pounds": 454,
//     //       "grams": 1,
//     //       "kilograms": 1000
//     //     }
//     //   };
//     // const densities = {
//     //     'water': 1,
//     //     'oil': 0.9,
//     //     'flour': 1.5,
//     //     'sugar': 1.6,
//     //     'salt': 2.16,
//     //     'baking powder': 0.5,
//     //     'baking soda': 0.5,
//     //     'yeast': 0.5,
//     //     'cinnamon': 0.6,
//     //     'nutmeg': 0.6,
//     //     'cloves': 0.6,
//     //     'honey': 1.4,
//     //     'molasses': 1.4,
//     //     'corn syrup': 1.4,
//     //     'cornstarch': 1.6,
//     //     'milk': 1.03,
//     //     'cream': 0.994,
//     //     'buttermilk': 1.03,
//     //     'sour cream': 0.996
//     // };
//     if (!Object.keys(conversionFactors.volumes).includes(unit) && !Object.keys(conversionFactors.weights).includes(unit)) {
//         throw new Error(`Unknown unit: ${unit}`);
//     }
//     // const density = densities[substance]
//     // const g = ml * density;
//     return weight * conversionFactors[unit];
// };
exports.costPerGram = function(a, b) {
    const ratio = a / b;
    const rounded = ratio.toFixed(2);
    return parseFloat(rounded);
};

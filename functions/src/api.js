const utils = require("./utils/utils.js");
const express = require("express");
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const bodyParser = require("body-parser");
const api = express();
const xmls = require("./utils/xmls");
const axios = require("axios");
const DOMParser = require("xmldom").DOMParser;
const {db, auth, globals} = require("./init.js");
const cors = require("cors");
const MERCHANT_ID = globals.MERCHANT_ID;
const AMOUNT = globals.AMOUNT;
const CURRENCY = globals.CURRENCY;
const SS = globals.SS;
const PAYER_REF = globals.PAYER_REF;
// const PMT_REF = globals.PMT_REF;
const ACCOUNT = globals.ACCOUNT;

api.use(bodyParser.json());
api.use(cors({origin: true}));

api.get("/getRealexHpp", (req, res) => {
  const ORDER_ID = utils.createOid();
  const TIMESTAMP = utils.timestampToYYYYMMDDHHMMSS();

  const SHA1HASH = utils.createADDSHA1(TIMESTAMP, ORDER_ID, MERCHANT_ID, AMOUNT, CURRENCY, PAYER_REF, "", SS);
  res.status(200).json({
    MERCHANT_ID: MERCHANT_ID,
    AMOUNT: AMOUNT,
    ACCOUNT: ACCOUNT,
    ORDER_ID: ORDER_ID,
    CURRENCY: CURRENCY,
    TIMESTAMP: TIMESTAMP,
    AUTO_SETTLE_FLAG: "0",
    PAYER_EXIST: "1",
    PAYER_REF: PAYER_REF,
    HPP_LANG: "en",
    CARD_PAYMENT_BUTTON: "Add card",
    CARD_STORAGE_ENABLE: "1",
    VALIDATE_CARD_ONLY: "1",
    HPP_VERSION: "2",
    SHA1HASH: SHA1HASH,
  });
});
api.post("/RealexEndpoint", (req, res) => {
    try {
      const data = req.body;
      functions.logger.debug("data", data);
      if (data.error) {
        res.status(500).json({error: data.message});
      } else {
        db.doc(`users/${data.uid}`)
          .set({
            cc: admin.firestore.FieldValue.arrayUnion({
              ORDER_ID: data.ORDER_ID,
              TIMESTAMP: data.TIMESTAMP,
              PASREF: data.PASREF,
              SAVED_PAYER_REF: data.SAVED_PAYER_REF,
              SAVED_PMT_DIGITS: data.SAVED_PMT_DIGITS,
              SAVED_PMT_EXPDATE: data.SAVED_PMT_EXPDATE,
              SAVED_PMT_NAME: data.SAVED_PMT_NAME,
              SAVED_PMT_REF: data.SAVED_PMT_REF,
              SAVED_PMT_TYPE: data.SAVED_PMT_TYPE,
              SHA1HASH: data.SHA1HASH,
              isSelectedCC: false,
          }),
        }, {merge: true});
        res.status(200).json({data: "Card Added Successfully"});
      }
    } catch (err) {
      functions.logger.debug("catch err", err);
      res.status(500).json({error: "Backend error, contact support"});
    }
});
function setUserToDb(user, json) {
  return new Promise((resolve, reject) => {
  db.doc(`users/${user.uid}`)
      .set({
        firstName: json.firstName,
        lastName: json.lastName,
        email: json.email,
        tel: json.tel,
        postalCode: json.postalCode,
        createdAt: new Date().toISOString(),
      });
  resolve();
  });
}
api.post("/users", (req, res) => {
  const data = req.body;
  auth.getUserByEmail(data.user.email)
  .then((userRecord) => {
    const errorMessage = "User already exists";
    functions.logger.debug(errorMessage);
    res.status(501).json({
    error: errorMessage,
    });
  }).catch((userRecord) => {
    auth.createUser({
    email: data.user.email,
    password: data.user.password,
  })
    .then((user) => {
      functions.logger.debug("Creating user,", user.uid);
      setUserToDb(user, data.user)
        .then(() => {
          functions.logger.debug("User created");
          res.status(200).json({
          message: "User created",
          uid: user.uid,
        });
    });
  }).catch(
      (err) => {
        functions.logger.debug("Error during user creation,", err);
        res.status(500).json({
          error: "Error during user creation, please try again",
        });
      }
    );
  });
});
api.post("/removeCC", (req, res) => {
  const ccToRemove = req.body;
  const uid = ccToRemove.uid;
  delete ccToRemove.uid;
  functions.logger.debug("Removing CC");
  const TIMESTAMP = utils.timestampToYYYYMMDDHHMMSS();
  functions.logger.debug("TIMESTAMP", TIMESTAMP);
  const ORDER_ID = utils.createOid();
  const SHA1HASH = utils.createDELETESHA1(TIMESTAMP, MERCHANT_ID, ccToRemove.SAVED_PAYER_REF, ccToRemove.SAVED_PMT_REF, SS);
  const data = xmls.deleteForm(TIMESTAMP, MERCHANT_ID, ORDER_ID, ACCOUNT, ccToRemove.SAVED_PMT_REF, ccToRemove.SAVED_PAYER_REF, SHA1HASH);
  functions.logger.debug("data", data);
  axios({
      method: "post",
      url: "https://api.sandbox.realexpayments.com/epage-remote.cgi",
      data: data,
      headers: {
          "Content-Type": "text/xml;charset=UTF-8",
      },
  }).then((xmlResponse) => {
    const doc = new DOMParser().parseFromString(xmlResponse.data);
    functions.logger.debug("delete,doc", doc.getElementsByTagName("message")[0].childNodes[0].nodeValue);
    const result = doc.getElementsByTagName("result")[0].childNodes[0].nodeValue;
    if (result === "00") {
      functions.logger.debug("CC Removed Successfully from Realex");
      functions.logger.debug("Removing CC from DB");
      db.doc(`users/${uid}`)
          .update({
            cc: admin.firestore.FieldValue.arrayRemove(ccToRemove),
          })
          .then(() => {
            functions.logger.debug("CC Removed Successfully from DB");
            res.status(200).json({data: "Card Removed Successfully"});
          })
          .catch((err) => {
            functions.logger.debug("Error during CC removal from DB,", err);
            res.status(500).json({error: "Error during CC removal from DB, please try again"});
          });
      } else {
        functions.logger.debug("Error during CC removal from Realex,", result);
        res.status(500).json({error: "Error during Card Removal, contact support"});
      }
    });
});
module.exports = api;


const express = require("express");
const functions = require("firebase-functions");
const bodyParser = require("body-parser");
const createUserApp = express();
const CryptoJS = require("crypto-js");
// const axios = require("axios");
const {db, auth} = require("./init.js");
const cors = require("cors");
const ORDER_ID = Math.random().toString(36).substring(2, 15);
const TIMESTAMP = timestampToYYYYMMDDHHMMSS();
const MERCHANT_ID = "dev944773432681974498";
const AMOUNT = 0;
const CURRENCY = "USD";
const SS = "B4Kxk3Ven1";
const PAYER_REF = "376a2598-412d-4805-9f47-c177d5605853";
const PMT_REF = "";
function createSHA1() {
  const sha1 = CryptoJS.SHA1(
    `${TIMESTAMP}.${MERCHANT_ID}.${ORDER_ID}.${AMOUNT}.${CURRENCY}.${PAYER_REF}.${PMT_REF}`);
  const shaSS = CryptoJS.SHA1(sha1.toString(CryptoJS.enc.Hex) + "." + SS);
  const shaSSHex = shaSS.toString(CryptoJS.enc.Hex);
  return shaSSHex;
}
function timestampToYYYYMMDDHHMMSS() {
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
}
createUserApp.use(bodyParser.json());
createUserApp.use(cors({origin: true}));

createUserApp.get("/getRealexHpp", (req, res) => {
  const SHA1HASH = createSHA1();
  res.status(200).json({
    MERCHANT_ID: MERCHANT_ID,
    AMOUNT: AMOUNT,
    ACCOUNT: "internet",
    ORDER_ID: ORDER_ID,
    CURRENCY: "USD",
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
createUserApp.post("/RealexEndpoint", (req, res) => {
    try {
      const data = req.body;
      functions.logger.debug("data", data);
      if (data.data.error) {
        res.status(500).json({error: data.data.error});
      } else {
        res.status(200).json({data: data});
      }
    } catch (err) {
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
// createUserApp.post("/login", (req, res) => {
//   const json = req.body;
//   auth.generateSignInWithEmailLink(json.email, json.password)
//       .then((data) => {
//         return res.status(200).json({data: data});
//       })
//       .catch((err) => {
//         functions.logger.debug("login attempt failed", err);
//         const errorMessage = "Wrong email or password";
//         return res.status(502).json({error: errorMessage});
//       });
// });
createUserApp.post("/", (req, res) => {
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
module.exports = createUserApp;


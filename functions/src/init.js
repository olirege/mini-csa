const admin = require("firebase-admin");
admin.initializeApp();

const db = admin.firestore();
const auth = admin.auth();
const globals = {
    MERCHANT_ID: "dev944773432681974498",
    AMOUNT: 0,
    CURRENCY: "USD",
    ACCOUNT: "internet",
    SS: "B4Kxk3Ven1",
    PAYER_REF: "376a2598-412d-4805-9f47-c177d5605853",
    PMT_REF: "88f578b7-f854-4ffc-b15e-163b05dc5f96",
    todayMidnight: dateFactory(0, 5),
    tomorrowMidnight: dateFactory(1, 5),
    dayAfterTomorrowMidnight: dateFactory(2, 5),
    in4daysAtMidnight: dateFactory(4, 5),
    in7daysAtMidnight: dateFactory(7, 5),
    timezone: "Canada/Eastern",
    conversionFactor: {
      "milligrams": 0.001,
      "grams": 1,
      "kilograms": 1000,
      "ounces": 28.3495,
      "pounds": 453.592,
      "milliliters": 1,
      "liters": 1000,
      "cubic meters": 1000000,
      },
};


function dateFactory(daysFromNow = 0, hourToSetTo = 0, now = false) {
    const date = new Date();
    if (now) {
      return date;
    } else {
      if (daysFromNow < 0) {
        throw new Error("daysFromNow cannot be negative");
      }
      if (hourToSetTo < 0) {
        throw new Error("hourToSetTo cannot be negative");
      }
      date.setDate(date.getDate() + daysFromNow);
      date.setHours(hourToSetTo, 0, 0, 0);
      return date;
    }
  }

module.exports = {
    db: db,
    auth: auth,
    globals: globals,
};

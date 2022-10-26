const functions = require("firebase-functions");
const createUserApp = require("./src/create-user.js");
const db = require("./src/init.js").db;
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
    });

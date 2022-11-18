const functions = require("firebase-functions");
const db = require("../init.js").db;

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

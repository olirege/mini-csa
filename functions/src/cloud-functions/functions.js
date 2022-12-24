const functions = require("firebase-functions");
const admin = require("firebase-admin");
const utils = require("../utils/utils.js");
const db = require("../init.js").db;
exports.onUserCreationCreateCart = functions.firestore
    .document("users/{userId}")
    .onCreate((snap, context) => {
        const userId = context.params.userId;
        db.doc(`carts/${userId}`)
        .set({
          balance: 0,
          items: [],
          scannedItems: [],
          createdAt: new Date().toISOString(),
        });
        db.doc(`oldcarts/${userId}`)
        .set({
            createdAt: new Date().toISOString(),
        });
    });
exports.onScheduledCheckoutAdjustItemToPickup = functions.firestore
    .document("oldcarts/{oldcartsId}/orders/{orderId}")
    .onCreate((snap, context) => {
        const order = snap.data();
        functions.logger.debug("Scheduled checkout adjust item to pickup", {order});
        const items = order.items;
        const promises = [];
        items.forEach((item) => {
            const itemRef = db.doc(`items/${item.iid}`);
            promises.push(itemRef.update({
                toscan: admin.firestore.FieldValue.increment(item.qty),
                incart: admin.firestore.FieldValue.increment(-item.qty),
            }));
            functions.logger.debug("Scheduled checkout adjust item to pickup", {item});
        });
        return Promise.all(promises);
    });
exports.onOrderScannedItemUpdate = functions.firestore
    .document("oldcarts/{oldcartsId}/orders/{orderId}")
    .onUpdate((change, context) => {
        const order = change.after.data();
        functions.logger.debug("Order scanned item update", {order});
        const scannedItems = order.scannedItems;
        const promises = [];
        scannedItems.forEach((item) => {
            const itemRef = db.doc(`items/${item.iid}`);
            promises.push(itemRef.update({
                toscan: admin.firestore.FieldValue.increment(-item.qty),
                topickup: admin.firestore.FieldValue.increment(item.qty),
            }));
            functions.logger.debug("Order scanned item update", {item});
        });
        const newUserBalance = order.checkoutTotal - order.scannedTotal;
        const userRef = db.doc(`users/${context.params.oldcartsId}`);
        promises.push(userRef.update({
            balance: admin.firestore.FieldValue.increment(newUserBalance),
        }));
        return Promise.all(promises);
    });
exports.onWriteIngredientAdjustToGram = functions.firestore
    .document("ingredients/{ingredientId}")
    .onWrite((change, context)=>{
        const ingredientRef = db.doc(`ingredients/${context.params.ingredientId}`);
        const ingredient = change.after.data();
        functions.logger.debug("converting ingredient weight in to grams", ingredient);
        // const unit = ingredient.unit;
        const weight = ingredient.weight;
        const cost = ingredient.cost;
        // const converted = utils.convertUnitIntoGrams(unit, weight);
        // functions.logger.debug("calculating cost per gram", unit, weight, cost, converted);
        const ratio = utils.costPerGram(cost, weight);

        ingredientRef.set({
            // convertedToGrams: converted,
            costPerUnit: ratio,
        }, {
            merge: true});
    });
exports.onCreateItemCreateRecipe = functions.firestore
    .document("items/{itemId}")
    .onCreate((snap, context) => {
        const item = snap.data();
        const iid = context.params.itemId;
        functions.logger.debug("creating recipe from item", item);
        const recipe = {
            name: "",
            ingredients: [],
            createdAt: new Date(),
            drafts: [],
        };
        const recipeRef = db.doc(`recipes/${iid}`);
        return recipeRef.set(recipe);
    });

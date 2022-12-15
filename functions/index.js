const scheduledFunctions = require("./src/cloud-functions/scheduled-functions.js");
const api = require("./src/cloud-functions/https.js");
const funcs = require("./src/cloud-functions/functions.js");

exports.scheduledCartReminders = scheduledFunctions.scheduledCartReminders;
exports.scheduledCloseEmptyCartsDueToday = scheduledFunctions.scheduledCloseEmptyCartsDueToday;
exports.scheduledCartCheckouts = scheduledFunctions.scheduledCartCheckouts;
exports.scheduledActiveCartOnOpenDate = scheduledFunctions.scheduledActiveCartOnOpenDate;
exports.onUserCreationCreateCart = funcs.onUserCreationCreateCart;
exports.onScheduledCheckoutAdjustItemToPickup = funcs.onScheduledCheckoutAdjustItemToPickup;
exports.onOrderScannedItemUpdate = funcs.onOrderScannedItemUpdate;
exports.onWriteIngredientAdjustToGram = funcs.onWriteIngredientAdjustToGram;
exports.api = api.api;
exports.createUser = api.createUser;


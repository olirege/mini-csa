exports.deleteForm = function(TIMESTAMP, MERCHANT_ID, ORDER_ID, ACCOUNT, SAVED_PMT_REF, SAVED_PAYER_REF, SHA1HASH) {
    return `<?xml version="1.0" encoding="UTF-8"?>
    <request type="card-cancel-card" timestamp="${TIMESTAMP}">
    <merchantid>${MERCHANT_ID}</merchantid>
    <account>${ACCOUNT}</account>
    <orderid>${ORDER_ID}</orderid>
    <card>
    <ref>${SAVED_PMT_REF}</ref>
    <payerref>${SAVED_PAYER_REF}</payerref>
    </card>
    <sha1hash>${SHA1HASH}</sha1hash>
    </request>`;
};
exports.chargeForm = function(TIMESTAMP, MERCHANT_ID, ACCOUNT, ORDER_ID, AMOUNT, CURRENCY, SAVED_PMT_REF, SAVED_PAYER_REF, SHA1HASH) {
    return `<?xml version="1.0" encoding="UTF-8"?>
    <request type="receipt-in" timestamp="${TIMESTAMP}">
    <merchantid>${MERCHANT_ID}</merchantid>
    <account>${ACCOUNT}</account>
    <channel>ECOM</channel>
    <orderid>${ORDER_ID}</orderid>
    <amount currency="${CURRENCY}">${AMOUNT}</amount>
    <autosettle flag="1"/>
    <payerref>${SAVED_PAYER_REF}</payerref>
    <paymentmethod>${SAVED_PMT_REF}</paymentmethod>
    <sha1hash>${SHA1HASH}</sha1hash>
    </request>`;
};

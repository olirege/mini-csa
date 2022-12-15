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

// exports.addForm = function(TIMESTAMP, MERCHANT_ID, ORDER_ID, ACCOUNT, AMOUNT, CURRENCY, CARD_NUMBER, CARD_EXPIRY_MONTH, CARD_EXPIRY_YEAR, CARD_CVN, SHA1HASH) {
//     return `<?xml version="1.0" encoding="UTF-8"?>
//     <request type="card-new" timestamp="20180614095601">
//       <merchantid>${MERCHANT_ID}</merchantid>
//       <account>>${ACCOUNT}</account>
//       <orderid>${ORDER_ID}</orderid>
//       <card>
//         <ref>10c6a2c7-be7b-a13f-12638937a012</ref>
//         <payerref>0f357b45-9aa4-4453-a685-c69232e9024f</payerref>
//         <number>4263970000005262</number>
//         <expdate>0519</expdate>
//         <chname>James Mason</chname>
//         <type>VISA</type>
//       </card>
//       <storedcredential>
//         <srd>MCCDX3FTU0212</srd>
//        </storedcredential>
//       <sha1hash>85fbaf68bb0e4fccd634facf6592b0677489709e</sha1hash>
//     </request>`
// };

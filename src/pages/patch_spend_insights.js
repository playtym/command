const fs = require('fs');
let text = fs.readFileSync('Spend.jsx', 'utf8');

const sIdx = text.indexOf('{/* ─── Spend Insights ─── */}');
const eIdx = text.indexOf('{/* ─── Recent Transactions (List) ─── */}');

if (sIdx > -1 && eIdx > -1) {
    console.log("FOUND!");
} else {
    console.log("Missing.");
}

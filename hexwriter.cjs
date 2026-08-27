const fs = require('fs');
const [,,p,hex] = process.argv;
fs.writeFileSync(p, Buffer.from(hex, 'hex').toString('utf8'));
console.log('Hex wrote: ' + p);
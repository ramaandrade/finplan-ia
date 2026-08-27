const fs = require('fs');
const [,,p,b] = process.argv;
fs.writeFileSync(p, Buffer.from(b, 'base64').toString('utf8'));
console.log('Wrote: ' + p);

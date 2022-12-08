const fs = require('fs');
const data = fs.readFileSync('input.txt', { encoding: 'utf8' });

const seq = [];
let i;

for (i = 0; i < data.length; i++) {
  if (seq.length === 4) {
    if ((new Set(seq)).size === seq.length) {
      break;
    }
    seq.shift();
  }
  seq.push(data[i]);
}

console.log(i);

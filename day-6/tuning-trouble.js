const fs = require('fs');
const data = fs.readFileSync('input.txt', { encoding: 'utf8' });

const getSequenceIndex = (n) => {
  const seq = [];
  let i;

  for (i = 0; i < data.length; i++) {
    if (seq.length === n) {
      if ((new Set(seq)).size === seq.length) {
        break;
      }
      seq.shift();
    }
    seq.push(data[i]);
  }

  return i;
}

// --- Part One ---

console.log(getSequenceIndex(4));

// --- Part Two ---

console.log(getSequenceIndex(14));

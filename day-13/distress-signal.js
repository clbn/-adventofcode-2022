const fs = require('fs');
const data = fs.readFileSync('input.txt', { encoding: 'utf8' });
const pairs = data.trim().split(/\r?\n\r?\n/)
  .map(pair => pair.split(/\r?\n/)
    .map(packet => JSON.parse(packet)));

const compare = (a, b) => {
  if (Number.isInteger(a) && Number.isInteger(b)) {
    return a < b ? -1 : a > b ? 1 : 0;
  }

  if (Number.isInteger(a)) {
    return compare([a], b);
  }

  if (Number.isInteger(b)) {
    return compare(a, [b]);
  }

  for (let i = 0; i < Math.max(a.length, b.length); i++) {
    if (a[i] === undefined) return -1;
    if (b[i] === undefined) return 1;
    const c = compare(a[i], b[i]);
    if (c !== 0) {
      return c;
    }
  }

  return 0;
};

// --- Part One ---

const goodOnes = pairs
  .map(([a, b]) => compare(a, b) < 1)
  .reduce((acc, v, i) => v ? acc + i + 1 : acc, 0);

console.log(goodOnes);

// --- Part Two ---

pairs.push([[[2]], [[6]]]);
const sorted = pairs.flat(1).sort(compare).map(JSON.stringify);
const d1 = sorted.indexOf('[[2]]') + 1;
const d2 = sorted.indexOf('[[6]]') + 1;

console.log(d1 * d2);

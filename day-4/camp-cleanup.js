const fs = require('fs');
const data = fs.readFileSync('input.txt', { encoding: 'utf8' });
const sections = data.trim().split(/\r?\n/)
  .map(line => line.split(/[,-]/)
    .map(n => +n));

// --- Part One ---

const fullyContained = sections.filter(([a, b, c, d]) =>
  (a >= c && b <= d) ||
  (a <= c && b >= d)
);

console.log(fullyContained.length);

// --- Part Two ---

const overlapped = sections.filter(([a, b, c, d]) =>
  (a <= c && b >= c) ||
  (a >= c && a <= d)
);

console.log(overlapped.length);

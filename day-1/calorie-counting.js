const fs = require('fs');
const data = fs.readFileSync('input.txt', { encoding: 'utf8' });
const elves = data.trim().split(/\r?\n\r?\n/)
  .map(elf => elf.split(/\r?\n/)
    .reduce((acc, cal) => acc + +cal, 0));

// --- Part One ---

const topLoad = Math.max(...elves);

console.log(topLoad);

// --- Part Two ---

const sortedElves = elves.sort((a, b) => a - b);
const topThreeLoad = sortedElves.slice(-3).reduce((acc, cal) => acc + cal, 0);

console.log(topThreeLoad);

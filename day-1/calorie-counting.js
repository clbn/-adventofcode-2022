const fs = require('fs');
const data = fs.readFileSync('input.txt', { encoding: 'utf8' });
const elves = data.trim().split(/\r?\n\r?\n/)
  .map(elf => elf.split(/\r?\n/)
    .reduce((acc, cal) => acc + +cal, 0));

const topLoad = Math.max(...elves);

console.log(topLoad);

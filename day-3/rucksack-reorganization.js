const fs = require('fs');
const data = fs.readFileSync('input.txt', { encoding: 'utf8' });
const rucksacks = data.trim().split(/\r?\n/);

const abc = '_abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

// --- Part One ---

const errors = rucksacks
  .map(r => {
    const h1 = r.slice(0, r.length / 2).split('');
    const h2 = r.slice(-r.length / 2).split('');
    return h1.find(l => h2.includes(l));
  })
  .reduce((acc, l) => acc + abc.indexOf(l), 0);

console.log(errors);

// --- Part Two ---

const groups = [];
for (let i = 0; i < rucksacks.length; i += 3) {
  groups.push(rucksacks.slice(i, i + 3));
}

const badges = groups
  .map(r => {
    const r1 = r[0].split('');
    const r2 = r[1].split('');
    const r3 = r[2].split('');
    return r1.filter(l => r2.includes(l)).filter(l => r3.includes(l))[0];
  })
  .reduce((acc, l) => acc + abc.indexOf(l), 0);

console.log(badges);

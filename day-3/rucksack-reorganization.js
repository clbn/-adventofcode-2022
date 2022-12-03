const fs = require('fs');
const data = fs.readFileSync('input.txt', { encoding: 'utf8' });
const rucksacks = data.trim().split(/\r?\n/);

const abc = '_abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

const errors = rucksacks
  .map(r => {
    const h1 = r.slice(0, r.length / 2).split('');
    const h2 = r.slice(-r.length / 2).split('');
    return h1.find(l => h2.includes(l));
  })
  .reduce((acc, l) => acc + abc.indexOf(l), 0);

console.log(errors);

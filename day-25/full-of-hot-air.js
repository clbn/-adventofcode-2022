const fs = require('fs');
const data = fs.readFileSync('input.txt', { encoding: 'utf8' });
const numbers = data.trim().split(/\r?\n/);

const snafu2quinary = { '2': '4', '1': '3', '0': '2', '-': '1', '=': '0' };
const quinary2snafu = { '4': '2', '3': '1', '2': '0', '1': '-', '0': '=' };

const parse = (s) => {
  const qui = s.replace(/./g, m => snafu2quinary[m]);
  const shift = '2'.repeat(s.length);
  return Number.parseInt(qui, 5) - Number.parseInt(shift, 5);
};

const stringify = (n) => {
  const len = n.toString(5).length;
  const shift = '2'.repeat(len);
  let qui = n + Number.parseInt(shift, 5);
  if (qui.toString(5).length > len) {
    qui += 2 * 5**len; // add another 2 to the extra quinary digit on the left
  }
  return qui.toString(5).replace(/./g, m => quinary2snafu[m]);
};

const sum = numbers.reduce((acc, n) => acc + parse(n), 0);
const snafuSum = stringify(sum);
console.log(snafuSum);

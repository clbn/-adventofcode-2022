const fs = require('fs');
const data = fs.readFileSync('input.txt', { encoding: 'utf8' });
const numbers = data.trim().split(/\r?\n/).map((n, i) => [i, +n]);

const mix = (list) => {
  const numbers = [...list];
  for (let i = 0; i < numbers.length; i++) {
    const from = numbers.findIndex(tuple => tuple[0] === i);
    const num = numbers[from][1];
    const to = (from + num) % (numbers.length - 1);
    if (num === 0) continue;
    numbers.splice(to, 0, ...numbers.splice(from, 1));
  }
  return numbers;
};

const getSum = (numbers) => {
  const coords = [1000, 2000, 3000];
  const zero = numbers.findIndex(tuple => tuple[1] === 0);
  return coords.reduce((acc, m) => acc + numbers[(zero + m) % numbers.length][1], 0);
};

// --- Part One ---

const mixed = mix(numbers);
const sum = getSum(mixed);
console.log(sum);

// --- Part Two ---

const key = 811589153;
let bigNumbers = numbers.map(t => [t[0], t[1] * key]);

let repeat = 10;
while (repeat--) bigNumbers = mix(bigNumbers);

const bigSum = getSum(bigNumbers);
console.log(bigSum);

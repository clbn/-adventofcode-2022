const fs = require('fs');
let riddle = fs.readFileSync('input.txt', { encoding: 'utf8' });

const reduce = (riddle) => {
  while (true) {
    // Retrieve and remove number-only entries
    const numbers = {};
    riddle = riddle.replace(/(\w+): (\d+)\r?\n/g, (_, name, num) => { numbers[name] = num; return ''; });

    // Return leftovers (if no more progress)
    if (!Object.keys(numbers).length) {
      return riddle;
    }

    // Replace variables with numbers
    riddle = riddle.replace(/ ([a-z]+)/g, (_, name) => ` ${numbers[name] ?? name}`);

    // Calculate all-number expressions
    riddle = riddle.replace(/ (\d+ . \d+)/g, (_, exp) => ` ${eval(exp)}`);

    // Return result (if one line left)
    if (riddle.match(/\n/g).length === 1) {
      return +riddle.match(/\d+/)[0];
    }
  }
}

// --- Part One ---

const root = reduce(riddle);
console.log(root);

// --- Part Two ---

const invert = (riddle) => {
  const opposite = { '*': '/', '/': '*', '-': '+', '+': '-' };
  return riddle
    .replace(/(\w+): ([a-z]+) ([+\-*/]) (\d+)/g, (_, a, b, op, num) => `${b}: ${a} ${opposite[op]} ${num}`)
    .replace(/(\w+): (\d+) ([+*]) ([a-z]+)/g, (_, a, num, op, b) => `${b}: ${a} ${opposite[op]} ${num}`)
    .replace(/(\w+): (\d+) ([\-/]) ([a-z]+)/g, (_, a, num, op, b) => `${b}: ${num} ${op} ${a}`);
};

const riddle2 = riddle.replace(/humn: .+\n/, '');
const leftover = reduce(riddle2).replace(/root: (\w+) [+\-*/] (\d+)/, '$1: $2');

const invertedLeftover = invert(leftover);
const humn = reduce(invertedLeftover);

console.log(humn);

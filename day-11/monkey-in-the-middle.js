const fs = require('fs');
const data = fs.readFileSync('input.txt', { encoding: 'utf8' });
const initialState = data.trim().split(/\r?\n\r?\n/).map(m => {
  const lines = m.split(/\r?\n/);
  return {
    items: [...lines[1].match(/\d+/g)].map(n => +n),
    operation: lines[2].match(/ = (.+)$/)[1],
    test: +lines[3].match(/\d+/),
    yes: +lines[4].match(/\d+/),
    no: +lines[5].match(/\d+/),
    business: 0,
  };
});

const getLevel = (rounds, divisor) => {
  const monkeys = JSON.parse(JSON.stringify(initialState));
  const inhibitor = monkeys.map(m => m.test).reduce((acc, b) => acc * b);

  while (rounds--) {
    monkeys.forEach(m => {
      m.items.forEach(old => {
        // `old` is inside eval
        const afterOp = Math.floor(eval(m.operation) / divisor);
        const destination = afterOp % m.test ? m.no : m.yes;
        monkeys[destination].items.push(afterOp % inhibitor);
        m.business++;
      })
      m.items = [];
    });
  }

  return monkeys.map(m => m.business)
    .sort((a, b) => a - b)
    .slice(-2)
    .reduce((acc, b) => acc * b)
};

// --- Part One ---

console.log(getLevel(20, 3));

// --- Part Two ---

console.log(getLevel(10000, 1));

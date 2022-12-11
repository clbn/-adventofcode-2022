const fs = require('fs');
const data = fs.readFileSync('input.txt', { encoding: 'utf8' });
const monkeys = data.trim().split(/\r?\n\r?\n/).map(m => {
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

let rounds = 20;
while (rounds--) {
  monkeys.forEach(m => {
    m.items.forEach(old => {
      // `old` is inside eval
      const afterOp = Math.floor(eval(m.operation) / 3);
      const destination = afterOp % m.test ? m.no : m.yes;
      monkeys[destination].items.push(afterOp);
      m.business++;
    })
    m.items = [];
  });
}

const level = monkeys.map(m => m.business)
  .sort((a, b) => a - b)
  .slice(-2)
  .reduce((acc, b) => acc * b)

console.log(level);

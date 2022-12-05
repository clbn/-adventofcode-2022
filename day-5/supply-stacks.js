const fs = require('fs');
const data = fs.readFileSync('input.txt', { encoding: 'utf8' });
let [stacks, procedure] = data.trimEnd().split(/\r?\n\r?\n/);

stacks = stacks.split(/\r?\n/).reverse().slice(1)
  .reduce((stacks, line) => {
    for (let i = 1, s = 1; i < line.length; i += 4, s++) {
      stacks[s] = stacks[s] ?? [];
      if (line[i] !== ' ') stacks[s].push(line[i]);
    }
    return stacks;
  }, [['']]);

procedure = procedure.split(/\r?\n/)
  .map(line => [...line.match(/\d+/g)]
    .map(n => +n));

// --- Part One ---

const sortedStacks = JSON.parse(JSON.stringify(stacks));

procedure.forEach(([n, from, to]) => {
  for (let i = 0; i < n; i++) {
    const crate = sortedStacks[from].pop();
    sortedStacks[to].push(crate);
  }
});

const topCrates = sortedStacks.reduce((acc, stack) => acc + stack.pop());

console.log(topCrates);

// --- Part Two ---

const resortedStacks = JSON.parse(JSON.stringify(stacks));

procedure.forEach(([n, from, to]) => {
  const crates = resortedStacks[from].splice(-n, n);
  resortedStacks[to].push(...crates);
});

const topCratesAgain = resortedStacks.reduce((acc, stack) => acc + stack.pop());

console.log(topCratesAgain);

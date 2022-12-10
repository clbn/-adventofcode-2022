const fs = require('fs');
const data = fs.readFileSync('input.txt', { encoding: 'utf8' });
const program = data.trim().split(/\r?\n/)
  .map(m => [m.slice(0,4), +m.slice(5)]);

let line = 0;
let cycle = 1;
let reg = 1;
let addxStarted = false;

const signals = [20, 60, 100, 140, 180, 220];
let strength = 0;
let screen = '';

while (line < program.length) {

  // --- Part Two ---

  const pos = (cycle - 1) % 40;
  const lit = Math.abs(reg - pos) <= 1;
  screen += lit ? '#' : '.';
  screen += cycle % 40 ? '' : '\n';

  // --- Part One ---

  if (signals.includes(cycle)) {
    strength += cycle * reg;
  }

  const [instruction, param] = program[line];

  if (instruction === 'noop') {
    line++;
  } else {
    if (addxStarted) {
      reg += param;
      line++;
    }
    addxStarted = !addxStarted;
  }

  cycle++;
}

console.log(strength);
console.log(screen);

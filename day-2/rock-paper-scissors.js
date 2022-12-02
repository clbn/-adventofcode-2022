const fs = require('fs');
const data = fs.readFileSync('input.txt', { encoding: 'utf8' });
const rounds = data.trim().split(/\r?\n/);

const points = {
  // A for Rock, B for Paper, C for Scissors
  // X for Rock, Y for Paper, Z for Scissors

  // 1 for Rock, 2 for Paper, 3 for Scissors +
  // 0 if you lost, 3 if a draw, 6 if you won

  'A X': 1 + 3,
  'B X': 1 + 0,
  'C X': 1 + 6,

  'A Y': 2 + 6,
  'B Y': 2 + 3,
  'C Y': 2 + 0,

  'A Z': 3 + 0,
  'B Z': 3 + 6,
  'C Z': 3 + 3,
};

const score = rounds.map(r => points[r]).reduce((acc, cal) => acc + cal, 0);

console.log(score);

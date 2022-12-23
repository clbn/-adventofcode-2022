const fs = require('fs');
const data = fs.readFileSync('input.txt', { encoding: 'utf8' });
const grove = data.trim().split(/\r?\n/).map(l => l.split('').map(t => t === '#'));

const directions = [
  [[0, -1], [-1, -1], [1, -1]], // North
  [[0, 1], [-1, 1], [1, 1]],    // South
  [[-1, 0], [-1, -1], [-1, 1]], // West
  [[1, 0], [1, -1], [1, 1]],    // East
];
const allNeighbors = directions.flat();
let proposed = {};
let rounds = 0;

const expand = () => {
  for (let y = 0; y < grove.length; y++) {
    grove[y].unshift(false);
    grove[y].push(false);
  }
  grove.unshift(Array(grove[0].length).fill(false));
  grove.push(Array(grove[0].length).fill(false));
};

const vacant = (x, y, tiles) => tiles.every(([dx, dy]) => !grove[y+dy][x+dx]);

const propose = (x, y) => {
  for (const d of directions) {
    if (vacant(x, y, d)) {
      const to = `${x + d[0][0]}-${y + d[0][1]}`;
      proposed[to] = proposed[to] ? null : [x, y];
      return;
    }
  }
};

const consider = () => {
  for (let y = 1; y < grove.length - 1; y++) {
    for (let x = 1; x < grove[y].length - 1; x++) {
      if (!grove[y][x]) continue; // this is not an elf
      if (vacant(x, y, allNeighbors)) continue; // elf doesn't have neighbors
      propose(x, y);
    }
  }
};

const move = () => {
  for (const [to, from] of Object.entries(proposed)) {
    if (from === null) continue; // considered by more than one elf, so nobody's moving here
    const [fx, fy] = from;
    const [tx, ty] = to.split('-').map(n => +n);
    grove[fy][fx] = false;
    grove[ty][tx] = true;
  }
  proposed = {};
  directions.push(directions.shift());
};

const reframe = () => {
  while (grove[0].indexOf(true) < 0) grove.shift();
  while (grove[grove.length-1].indexOf(true) < 0) grove.pop();
  while (grove.map(r => r[0]).indexOf(true) < 0) grove.forEach(r => r.shift());
  while (grove.map(r => r[r.length-1]).indexOf(true) < 0) grove.forEach(r => r.pop());
};

const diffuse = (limit = 1000) => {
  while (limit--) {
    rounds++;
    expand();
    consider();
    if (!Object.keys(proposed).length) break;
    move();
    reframe();
  }
};

// --- Part One ---

diffuse(10);
const emptyTiles = grove.flat().filter(t => !t).length;
console.log(emptyTiles);

// --- Part Two ---

diffuse();
console.log(rounds);

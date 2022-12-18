const fs = require('fs');
const data = fs.readFileSync('input.txt', { encoding: 'utf8' });
const lines = data.trim().split(/\r?\n/);

const droplets = lines.map(row => row.split(',').map(n => +n));
const lava = new Set(lines);
const directions = [[-1, 0, 0], [1, 0, 0], [0, -1, 0], [0, 1, 0], [0, 0, -1], [0, 0, 1]];

const surface = droplets.reduce((acc, [x, y, z]) => {
  const neighbors = directions.filter(([dx, dy, dz]) => lava.has(`${x+dx},${y+dy},${z+dz}`))
  return acc - neighbors.length;
}, droplets.length * 6);

console.log(surface);

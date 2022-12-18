const fs = require('fs');
const data = fs.readFileSync('input.txt', { encoding: 'utf8' });
const lines = data.trim().split(/\r?\n/);

const droplets = lines.map(row => row.split(',').map(n => +n));
const lava = new Set(lines);
const directions = [[-1, 0, 0], [1, 0, 0], [0, -1, 0], [0, 1, 0], [0, 0, -1], [0, 0, 1]];

// --- Part One ---

const surface = droplets.reduce((acc, [x, y, z]) => {
  const neighbors = directions.filter(([dx, dy, dz]) => lava.has(`${x+dx},${y+dy},${z+dz}`))
  return acc - neighbors.length;
}, droplets.length * 6);

console.log(surface);

// --- Part Two ---

const [min, max] = droplets.reduce(
  ([[xmin, ymin, zmin], [xmax, ymax, zmax]], [x, y, z]) => [
    [Math.min(xmin, x-1), Math.min(ymin, y-1), Math.min(zmin, z-1)],
    [Math.max(xmax, x+1), Math.max(ymax, y+1), Math.max(zmax, z+1)],
  ],
  [[Infinity, Infinity, Infinity], [-Infinity, -Infinity, -Infinity]]
);
const [xmin, ymin, zmin] = min;
const [xmax, ymax, zmax] = max;

const air = new Set();
air.add(min.join(','));

const explore = ([x, y, z]) =>
  (x >= xmin && y >= ymin && z >= zmin) &&
  (x <= xmax && y <= ymax && z <= zmax) &&
  !lava.has(`${x},${y},${z}`) &&
  !air.has(`${x},${y},${z}`);

const queue = [min];
while (queue.length > 0) {
  const [cx, cy, cz] = queue.shift();
  for (const [dx, dy, dz] of directions) {
    const next = [cx + dx, cy + dy, cz + dz];
    if (explore(next)) {
      queue.push(next);
      air.add(next.join(','));
    }
  }
}

const exterior = droplets.reduce((acc, [x, y, z]) => {
  const neighbors = directions.filter(([dx, dy, dz]) => !air.has(`${x+dx},${y+dy},${z+dz}`))
  return acc - neighbors.length;
}, droplets.length * 6);

console.log(exterior);

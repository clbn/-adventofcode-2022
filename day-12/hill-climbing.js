const fs = require('fs');
const data = fs.readFileSync('input.txt', { encoding: 'utf8' });

const map = data.trim().split(/\r?\n/).map(row => row.split(''));
const directions = [[0, -1], [1, 0], [0, 1], [-1, 0]];

const getZ = z => {
  if (z === 'S') return 0;
  if (z === 'E') return 25;
  return 'abcdefghijklmnopqrstuvwxyz'.indexOf(z);
};

const exploreNext = (map, current, x, y) => {
  if (!map[y] || !map[y][x] || map[y][x] === '.') {
    return false;
  } else {
    const a = current.z;
    const b = map[y][x];
    if ((getZ(b) - getZ(a)) > 1) {
      return false;
    }
  }

  const path = [...current.path, [x, y]];
  const z = map[y][x];
  map[y][x] = '.';

  return { x, y, z, path };
};

const getPath = (map, start, goal) => {
  const queue = [start];

  while (queue.length > 0) {
    const curr = queue.shift();

    for (const dir of directions) {
      const nx = curr.x + dir[0];
      const ny = curr.y + dir[1];
      const next = exploreNext(map, curr, nx, ny);

      if (next) {
        if (next.z === goal) {
          return next.path;
        }
        queue.push(next);
      }
    }
  }
}

const sy = map.findIndex(row => row.includes('S'));
const sx = map[sy].indexOf('S');
const start = { x: sx, y: sy, z: map[sy][sx], path: [] };
map[sy][sx] = '.';

const path = getPath(map, start, 'E');

console.log(path.length);

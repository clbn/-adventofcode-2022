const fs = require('fs');
const data = fs.readFileSync('input.txt', { encoding: 'utf8' });

const rawMap = data.trim().split(/\r?\n/);
const directions = [[0, -1], [1, 0], [0, 1], [-1, 0]];

const getZ = z => {
  if (z === 'S') return 0;
  if (z === 'E') return 25;
  return 'abcdefghijklmnopqrstuvwxyz'.indexOf(z);
};

const exploreNext = (map, current, x, y, canClimb) => {
  if (!map[y]?.[x] || map[y][x] === '.' || !canClimb(current.z, map[y][x])) {
    return false;
  }

  const path = [...current.path, [x, y]]; // seems like for this puzzle, a counter would do
  const z = map[y][x];
  map[y][x] = '.';

  return { x, y, z, path };
};

const getPath = (map, start, goal, climbFn) => {
  const queue = [start];

  while (queue.length > 0) {
    const curr = queue.shift();

    for (const dir of directions) {
      const nx = curr.x + dir[0];
      const ny = curr.y + dir[1];
      const next = exploreNext(map, curr, nx, ny, climbFn);

      if (next) {
        if (next.z === goal) {
          return next.path;
        }
        queue.push(next);
      }
    }
  }
}

const parseFindMeasure = (sx, sy, goal, climbFn) => {
  const map = rawMap.map(row => row.split(''));

  const start = { x: sx, y: sy, z: map[sy][sx], path: [] };
  map[sy][sx] = '.';

  const path = getPath(map, start, goal, climbFn);

  return path?.length;
}

// --- Part One ---

const sy = rawMap.findIndex(row => row.includes('S'));
const sx = rawMap[sy].indexOf('S');
const canClimbUp = (a, b) => (getZ(b) - getZ(a)) <= 1;

const bestPath = parseFindMeasure(sx, sy, 'E', canClimbUp);

console.log(bestPath);

// --- Part Two ---

const ey = rawMap.findIndex(row => row.includes('E'));
const ex = rawMap[ey].indexOf('E');
const canClimbDown = (a, b) => (getZ(a) - getZ(b)) <= 1;

const bestTrail = parseFindMeasure(ex, ey, 'a', canClimbDown);

console.log(bestTrail);

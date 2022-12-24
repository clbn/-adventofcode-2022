const fs = require('fs');
const data = fs.readFileSync('input.txt', { encoding: 'utf8' });

const rawMap = data.trim().split(/\r?\n/);
const height = rawMap.length;
const width = rawMap[0].length;

const moves = { '^': [0, -1], '>': [1, 0], 'v': [0, 1], '<': [-1, 0] };
const options = [[0, 0], ...Object.values(moves)]; // you can stay or you can go

const map = [];
const weather = [];
for (let y = 0; y < height; y++) {
  map[y] = [];
  for (let x = 0; x < width; x++) {
    const t = rawMap[y][x];
    map[y][x] = t === '.';
    const d = moves[t];
    if (d) weather.push([x, y, ...d]);
  }
}

const cachedMaps = [map];
const getMap = (minute) => {
  if (cachedMaps[minute]) return cachedMaps[minute];

  // Next-step weather (we don't need history)
  for (const b of weather) {
    b[0] += b[2];
    b[1] += b[3];
    if (b[0] === 0) b[0] = width - 2;  // reached left, move to right
    if (b[0] === width - 1) b[0] = 1;  // reached right, move to left
    if (b[1] === 0) b[1] = height - 2; // reached top, move to bottom
    if (b[1] === height - 1) b[1] = 1; // reached bottom, move to top
  }

  // Next-step map
  const newMap = [];
  for (let y = 0; y < height; y++) {
    newMap[y] = [];
    for (let x = 0; x < width; x++) {
      if (x === 0 || y === 0 || x === width - 1 || y === height - 1) {
        newMap[y][x] = map[y][x]; // copy walls, entrance, exit
      } else {
        newMap[y][x] = weather.findIndex(b => b[0] === x && b[1] === y) < 0; // vacant if there's no blizzard with such coords
      }
    }
  }

  cachedMaps[minute] = newMap;
  return newMap;
};

const exploreNext = (current, x, y) => {
  const time = current.time + 1;
  const map = getMap(time);
  if (!map[y]?.[x]) return false;
  return { x, y, time };
};

const distance = (ax, ay, bx, by) => Math.abs(ax - bx) + Math.abs(ay - by);

const compare = end => (a, b) => a.time - b.time + distance(end.x, end.y, a.x, a.y) - distance(end.x, end.y, b.x, b.y)

const getFastestPath = (start, end, time = 0) => {
  let minTime = Infinity;
  const queue = [{ ...start, time }];
  const visited = new Set();

  while (queue.length > 0) {
    queue.sort(compare(end));

    const curr = queue.shift();

    if (curr.time + distance(end.x, end.y, curr.x, curr.y) > minTime) {
      continue; // wouldn't make it anyway
    }

    for (const dir of options) {
      const nx = curr.x + dir[0];
      const ny = curr.y + dir[1];
      const next = exploreNext(curr, nx, ny);

      if (next) {
        const key = JSON.stringify(next);
        if (visited.has(key)) continue;
        if (next.x === end.x && next.y === end.y) {
          minTime = Math.min(minTime, next.time);
          continue;
        }
        queue.push(next);
        visited.add(key);
      }
    }
  }

  return minTime;
}

const start = { x: 1, y: 0 };
const end = { x: width - 2, y: height - 1 };

// There
let time = getFastestPath(start, end);
console.log('There:', time);

// ...and back
time = getFastestPath(end, start, time);

// ...and there again
time = getFastestPath(start, end, time);
console.log('There and back and there again:', time);

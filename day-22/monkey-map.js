const fs = require('fs');
const data = fs.readFileSync('input.txt', { encoding: 'utf8' });

const [rawMap, rawRoute ] = data.split(/\r?\n\r?\n/);
const map = rawMap.split(/\r?\n/).map(l => l.split('').map(p => p === ' ' ? null : p));
const route = [...rawRoute.trim().matchAll(/(\d+)([A-Z]?)/g)].map(m => [+m[1], m[2]]);

const moves = { U: [0, -1], R: [1, 0], D: [0, 1], L: [-1, 0] };
const turns = { U: { R: 'R', L: 'L' }, R: { R: 'D', L: 'U' }, D: { R: 'L', L: 'R' }, L: { R: 'U', L: 'D' } };
const start = { x: map[0].indexOf('.'), y: 0, d: 'R' };

const walk = (getNext) => {
  let state = { ...start };

  route.forEach(([len, turn]) => {
    while (len--) {
      const { x, y, d } = getNext(state);
      if (map[y][x] === '#') break;
      state = { x, y, d };
    }

    if (turn) {
      state.d = turns[state.d][turn];
    }
  });

  return state;
};

// --- Part One ---

const wrapToStart = (a, cb) => a.findIndex(cb);
const wrapToEnd = (a, cb) => {
  for (let i = a.length - 1; i >= 0; i--) if (cb(a[i])) return i;
  return -1;
};

const step = ({ x, y, d }) => {
  const [dx, dy] = moves[d];
  x = x + dx;
  y = y + dy;
  if (!map[y]?.[x]) {
    switch (d) {
      case 'R': x = wrapToStart(map[y], p => p && p !== ' '); break;
      case 'L': x = wrapToEnd(map[y], p => p && p !== ' '); break;
      case 'D': y = wrapToStart(map, l => l[x] && l[x] !== ' '); break;
      case 'U': y = wrapToEnd(map, l => l[x] && l[x] !== ' '); break;
    }
  }
  return { x, y, d };
};

const end = walk(step);
const password = 1000 * (end.y + 1) + 4 * (end.x + 1) + ['R', 'D', 'L', 'U'].indexOf(end.d);
console.log(password);

// --- Part Two ---

const hop = ({ x, y, d }) => {
  // This only supports one particular kind of cube net:
  //   ⚁ ⚀
  //   ⚂
  // ⚅ ⚄
  // ⚃

  const e = 50; // length of cube edge

  if (d === 'U' && y === 0 && x >= e && x < e*2) return { x: 0, y: x+e*2, d: 'R' };
  if (d === 'U' && y === 0 && x >= e*2 && x < e*3) return { x: x-e*2, y: e*4-1, d: 'U' };
  if (d === 'U' && y === e*2 && x >= 0 && x < e) return { x: e, y: x+e, d: 'R' };

  if (d === 'D' && y === e-1 && x >= e*2 && x < e*3) return { x: e*2-1, y: x-e, d: 'L' };
  if (d === 'D' && y === e*3-1 && x >= e && x < e*2) return { x: e-1, y: x+e*2, d: 'L' };
  if (d === 'D' && y === e*4-1 && x >= 0 && x < e) return { x: x+e*2, y: 0, d: 'D' };

  if (d === 'L' && x === e && y >= 0 && y < e) return { x: 0, y: e*3-y-1, d: 'R' };
  if (d === 'L' && x === e && y >= e && y < e*2) return { x: y-e, y: e*2, d: 'D' };
  if (d === 'L' && x === 0 && y >= e*2 && y < e*3) return { x: e, y: e*3-y-1, d: 'R' };
  if (d === 'L' && x === 0 && y >= e*3 && y < e*4) return { x: y-e*2, y: 0, d: 'D' };

  if (d === 'R' && x === e*3-1 && y >= 0 && y < e) return { x: e*2-1, y: e*3-y-1, d: 'L' };
  if (d === 'R' && x === e*2-1 && y >= e && y < e*2) return { x: y+e, y: e-1, d: 'U' };
  if (d === 'R' && x === e*2-1 && y >= e*2 && y < e*3) return { x: e*3-1, y: e*3-y-1, d: 'L' };
  if (d === 'R' && x === e-1 && y >= e*3 && y < e*4) return { x: y-e*2, y: e*3-1, d: 'U' };

  const [dx, dy] = moves[d];
  return { x: x+dx, y: y+dy, d };
};

const fin = walk(hop);
const shibboleth = 1000 * (fin.y + 1) + 4 * (fin.x + 1) + ['R', 'D', 'L', 'U'].indexOf(fin.d);
console.log(shibboleth);

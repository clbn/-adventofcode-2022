const fs = require('fs');
const data = fs.readFileSync('input.txt', { encoding: 'utf8' });

const lines = data.trim().split(/\r?\n/)
  .map(line => [...line.match(/-?\d+/g)]
    .map(n => +n));

const distance = (ax, ay, bx, by) => Math.abs(ax - bx) + Math.abs(ay - by);

const xx = new Set();
const y = 2000000;

for (const [sx, sy, bx, by] of lines) {
  const can = distance(sx, sy, bx, by);
  const need = distance(0, sy, 0, y);
  const touch = can - need;
  if (touch >= 0) {
    const x1 = sx - touch;
    const x2 = sx + touch;
    for (let i = x1; i <= x2; i++)
      if (bx !== i || by !== y) // exclude random beacons
        xx.add(i);
  }
}

console.log(xx.size);

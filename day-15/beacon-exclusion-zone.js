const fs = require('fs');
const data = fs.readFileSync('input.txt', { encoding: 'utf8' });

const lines = data.trim().split(/\r?\n/)
  .map(line => [...line.match(/-?\d+/g)]
    .map(n => +n));

// --- Part One ---

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

// --- Part Two ---

const joinRangesOrDiscoverGap = ([a, b], [c, d]) => {
  if (b + 1 < c) return b + 1;
  if (d + 1 < a) return d + 1;
  return [Math.min(a, c), Math.max(b, d)];
};

const clearOneLine = (y) => {
  const ranges = [];

  for (const [sx, sy, bx, by] of lines) {
    const can = distance(sx, sy, bx, by);
    const need = distance(0, sy, 0, y);
    const touch = can - need;
    if (touch >= 0) {
      ranges.push([sx - touch, sx + touch]);
    }
  }

  ranges.sort((a, b) => a[0] - b[0]);

  while (ranges.length > 1) {
    const r1 = ranges.shift();
    const r2 = ranges.shift();
    const rangeOrGap = joinRangesOrDiscoverGap(r1, r2);

    if (Number.isInteger(rangeOrGap)) {
      return rangeOrGap; // found the gap
    }

    ranges.unshift(rangeOrGap);
  }

  return null;
};

let gapx = 0;
let gapy = 4000000;

while (gapy--) {
  gapx = clearOneLine(gapy);
  if (gapx !== null) break;
}

console.log(gapx * 4000000 + gapy);

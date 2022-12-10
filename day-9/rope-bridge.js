const fs = require('fs');
const data = fs.readFileSync('input.txt', { encoding: 'utf8' });
const motions = data.trim().split(/\r?\n/).map(m => [m[0], +m.slice(2)]);

const step = {
  L: { y: 0, x: -1 },
  R: { y: 0, x: 1 },
  U: { y: -1, x: 0 },
  D: { y: 1, x: 0 },
};

const yank = (head, tail) => {
  const dy = head.y - tail.y;
  const dx = head.x - tail.x;

  if (Math.abs(dy) > 1 || Math.abs(dx) > 1) {
    tail.y += Math.max(-1, Math.min(1, dy));
    tail.x += Math.max(-1, Math.min(1, dx));
  }
};

const visited = new Set();

// --- Part One ---

const head = { y: 0, x: 0 };
const tail = { y: 0, x: 0 };

motions.forEach(([direction, distance]) => {
  while (distance--) {
    head.y += step[direction].y;
    head.x += step[direction].x;

    yank(head, tail);

    visited.add(JSON.stringify(tail));
  }
});

console.log(visited.size);

// --- Part Two ---

visited.clear();
const length = 10;
const rope = Array(length).fill(0).map(() => ({ y: 0, x: 0 }));

motions.forEach(([direction, distance]) => {
  while (distance--) {
    rope[0].y += step[direction].y;
    rope[0].x += step[direction].x;

    for (let i = 1; i < rope.length; i++) {
      yank(rope[i-1], rope[i]);
    }

    visited.add(JSON.stringify(rope[rope.length-1]));
  }
});

console.log(visited.size);

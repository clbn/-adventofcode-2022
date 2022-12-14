const fs = require('fs');
const data = fs.readFileSync('input.txt', { encoding: 'utf8' });
const paths = data.trim().split(/\r?\n/)
  .map(path => path.split(' -> ')
    .map(node => node.split(',')
      .map(n => +n)));

const addRock = (wall, [ax, ay], [bx, by]) => {
  if (ax === bx) {
    const min = Math.min(ay, by);
    const max = Math.max(ay, by);
    let len = max - min + 1;
    while (len--) {
      const y = min + len;
      wall[y] = wall[y] ?? [];
      wall[y][ax] = true;
    }
  }

  if (ay === by) {
    const min = Math.min(ax, bx);
    const max = Math.max(ax, bx);
    let len = max - min + 1;
    while (len--) {
      const x = min + len;
      wall[ay] = wall[ay] ?? [];
      wall[ay][x] = true;
    }
  }
};

const buildWall = (paths) => {
  const wall = [];

  for (const path of paths) {
    for (let i = 1; i < path.length; i++) {
      addRock(wall, path[i - 1], path[i]);
    }
  }

  wall.bottom = wall.length - 1;

  for (let y = 0; y <= wall.bottom + 2; y++) {
    wall[y] = wall[y] ?? [];
  }

  return wall;
}

const pourSand = (wall) => {
  let amount = 0;

  while (true) {
    let [x, y] = [500, 0];

    while (true) {
      const next = [x, x-1, x+1].find(xx => !wall[y+1][xx]);

      if (!next) {
        wall[y][x] = true;
        break; // unit of sand stopped
      }

      if (y > wall.bottom) {
        return amount; // sand starts flowing into the abyss
      }

      [x, y] = [next, y+1];
    }

    amount++;
  }
};

const wall = buildWall(paths);

const amount = pourSand(wall);

console.log(amount);

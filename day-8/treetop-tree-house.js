const fs = require('fs');
const data = fs.readFileSync('input.txt', { encoding: 'utf8' });
const trees = data.trim().split(/\r?\n/);

const width = trees[0].length;
const height = trees.length;

const visi = [...Array(height)].map(_ => []); // empty matrix for visibilities

function update(y, x, max) {
  if (trees[y][x] > max) {
    visi[y][x] = true;
    return trees[y][x];
  }
  return max;
}

for (let y = 0; y < height; y++) {
  for (let max = -1, x = 0; x < width; x++)       { max = update(y, x, max); } // look from left
  for (let max = -1, x = width - 1; x >= 0; x--)  { max = update(y, x, max); } // look from right
}

for (let x = 0; x < width; x++) {
  for (let max = -1, y = 0; y < height; y++)      { max = update(y, x, max); } // look from top
  for (let max = -1, y = height - 1; y >= 0; y--) { max = update(y, x, max); } // look from bottom
}

const totalVisible = visi.reduce((acc, line) => acc + line.filter(t => t).length, 0);

console.log(totalVisible);

const fs = require('fs');
const data = fs.readFileSync('input.txt', { encoding: 'utf8' });
const trees = data.trim().split(/\r?\n/);

const width = trees[0].length;
const height = trees.length;

// --- Part One ---

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

// --- Part Two ---

const sceni = [...Array(height)].map(_ => []); // empty matrix for scenic scores

for (let y = 0; y < height; y++) {
  for (let x = 0; x < width; x++) {
    const t = trees[y][x];
    let l = 0, r = 0, u = 0, d = 0;
    for (let xx = x-1; xx >= 0; xx--)     { l++; if (trees[y][xx] >= t) break; } // look left
    for (let xx = x+1; xx < width; xx++)  { r++; if (trees[y][xx] >= t) break; } // look right
    for (let yy = y-1; yy >= 0; yy--)     { u++; if (trees[yy][x] >= t) break; } // look up
    for (let yy = y+1; yy < height; yy++) { d++; if (trees[yy][x] >= t) break; } // look down
    sceni[y][x] = l * r * u * d;
  }
}

const maxScore = Math.max(...sceni.map(line => Math.max(...line)));

console.log(maxScore);

const fs = require('fs');
const data = fs.readFileSync('input.txt', { encoding: 'utf8' });
const lines = data.trim().split(/\r?\n/);

const dirs = {};
let wd = [''];

const file = size => {
  wd.forEach((_, i, wd) => {
    const path = wd.slice(0, i + 1).join('/');
    dirs[path] = (dirs[path] || 0) + size;
  });
};

const cd = d => {
  switch (d) {
    case '/': wd = ['']; break;
    case '..': wd.pop(); break;
    default: wd.push(d);
  }
};

lines.forEach(l => {
  switch (l.slice(0, 3)) {
    case 'dir': break;
    case '$ l': break;
    case '$ c': cd(l.slice(5)); break;
    default: file(+l.split(' ')[0]);
  }
});

const sizes = Object.values(dirs);
const sumOfSmall = sizes.filter(s => s <= 100000).reduce((acc, s) => acc + s);
console.log(sumOfSmall);

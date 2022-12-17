const fs = require('fs');
const data = fs.readFileSync('input.txt', { encoding: 'utf8' });
const jets = data.trim();

const rocks = [
  [0b000111100], // —
  [0b000010000, 0b000111000, 0b000010000], // +
  [0b000111000, 0b000001000, 0b000001000], // ｣
  [0b000100000, 0b000100000, 0b000100000, 0b000100000], // |
  [0b000110000, 0b000110000], // ◼
];

const canLeft = (ch, y, rock) => !rock.some((r, i) => r << 1 & ch[y+i]);
const canRight = (ch, y, rock) => !rock.some((r, i) => r >> 1 & ch[y+i]);
const canDown = (ch, y, rock) => !rock.some((r, i) => r & ch[y+i-1]);

const moveLeft = (ch, y, rock) => canLeft(ch, y, rock) ? rock.map(r => r << 1) : rock;
const moveRight = (ch, y, rock) => canRight(ch, y, rock) ? rock.map(r => r >> 1) : rock;
const land = (ch, y, rock) => rock.forEach((r, i) => ch[y+i] |= r);

const chamber = [];
let height = 0;
let rounds = 0;
let moves = 0;

while (rounds < 2022) {
  let y = height + 3;
  let rock = [...rocks[rounds++ % rocks.length]];

  while (chamber.length < height + 3 + rock.length) {
    chamber.push(0b100000001);
  }

  while (true) {
    const jet = jets[moves++ % jets.length];
    if (jet === '<') rock = moveLeft(chamber, y, rock);
    if (jet === '>') rock = moveRight(chamber, y, rock);

    if (y > 0 && canDown(chamber, y, rock)) {
      y--;
    } else {
      land(chamber, y, rock);
      height = Math.max(height, y + rock.length);
      break;
    }
  }
}

console.log(height);

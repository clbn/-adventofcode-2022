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

// For the part 2, we look for repeating samples
const totalRounds = 1_000_000_000_000;
let samples = new Set();
let knownSample;
let cycles = { started: false, ended: false, needed: 0 }; // If first cycle started, if first cycle ended, how many cycles needed
let rr = {}; // Rounds: pre-cycle, in-cycle and post-cycle
let hh = {}; // Heights: pre-cycle, in-cycle and post-cycle

// A sample = current rock + current move + top 10 lines of the tower (without walls, encoded into a string)
const getSample = (ch, h, r, m) => r + '/' + m + '/' + String.fromCharCode(...ch.slice(h-10, h).map(n => (n & 0b011111110) >> 1));

while (rounds < totalRounds) {
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

  if (rounds === 2022) {
    console.log(`Height after 2022 rocks:`, height);
  }

  const sample = getSample(chamber, height, rounds % rocks.length, moves % jets.length);

  if (cycles.started && cycles.ended && rounds === rr.pre + rr.in + rr.post) {
    // Third point of interest:
    // the remainder (after-cycle) height is calculated, now we got all we need
    hh.post = height - hh.pre - hh.in;
    break;
  }

  if (cycles.started && !cycles.ended && sample === knownSample) {
    // Second point of interest:
    // found the same sample again, the first iteration of cycle ended
    cycles.ended = true;
    rr.in = rounds - rr.pre;
    hh.in = height - hh.pre;
    cycles.needed = Math.floor((totalRounds - rr.pre) / rr.in);
    rr.post = totalRounds - rr.pre - cycles.needed * rr.in;
    hh.post = height;
  }

  if (!cycles.started && samples.has(sample)) {
    // First point of interest:
    // found a known sample, the first iteration of cycle started
    cycles.started = true;
    knownSample = sample;
    rr.pre = rounds;
    hh.pre = height;
  }

  samples.add(sample);
}

const height2 = hh.pre + hh.in * cycles.needed + hh.post;
console.log(`Height after ${totalRounds} rocks:`, height2);

const fs = require('fs');
const dijkstra = require('./lib/dijkstra');

const data = fs.readFileSync('input.txt', { encoding: 'utf8' });
const rawList = data.trim().split(/\r?\n/);

// Gather initial data

const graph = {};
const rates = {};
const nonZeroValves = [];

rawList.forEach(line => {
  let [, valve, rate, links] = [...line.match(/Valve (\w+) .+=(\d+);.+valves? (.+)$/)];
  rates[valve] = +rate;
  graph[valve] = links.split(', ').map(l => ({ vertex: l, cost: 1 }));
  if (+rate) nonZeroValves.push(valve);
});

// Precalculate distances from all to all

const distances = {};
const nodes = ['AA', ...nonZeroValves];
for (const n1 of nodes) {
  for (const n2 of nodes) {
    if (n1 !== n2) {
      distances[`${n1}-${n2}`] = dijkstra(graph, n1, n2) + 1; // plus 1 minute to open the valve in the end
    }
  }
}

// Go through <s>all</s> necessary permutations and get max pressure score

const evaluateRoute = (route, limit) => route.reduce((acc, curr, i) => {
  const prev = route[i-1] || 'AA';
  const minutes = acc.minutes + distances[`${curr}-${prev}`];
  const score = acc.score + rates[curr] * (limit - minutes);
  return { score, minutes };
}, { score: 0, minutes: 0 });

let maxScore = 0;

const checkEveryPermutation = (list, limit, pre = []) => {
  const r = [];

  for (let i = 0; i < list.length; i++) {
    const ancestors = [...pre, list[i]];
    const ev = evaluateRoute(ancestors, limit);
    if (ev.minutes > limit) {
      continue; // variant list goes down from 15! to 280k items
    }
    maxScore = Math.max(maxScore, ev.score);

    const oneRemoved = [...list.slice(0, i), ...list.slice(i + 1)];
    const rest = checkEveryPermutation(oneRemoved, limit, ancestors);
    if (!rest.length) {
      r.push([list[i]]);
    } else {
      for (let j = 0; j < rest.length; j++) {
        r.push([list[i], ...rest[j]]);
      }
    }
  }

  return r;
}

// --- Part One ---

const permutations = checkEveryPermutation(nonZeroValves, 30);
console.log('Permutations 30m:', permutations.length);
console.log('Max score:', maxScore);

// --- Part Two ---

// 2.1. Get permutations for 26 minutes

const permutations2 = checkEveryPermutation(nonZeroValves, 26);
console.log('Permutations 26m:', permutations2.length);

// 2.2. Filter them by lengths and calc their scores

const filteredPerms = [];
for (let i = 0; i < permutations2.length; i++) {
  const p = permutations2[i];
  const ev = evaluateRoute(p, 26);

  // Subjective filtering, adjust if needed
  if (p.length < 6 || p.length > 7) continue; // 64681² → 33184² variants, 55 → 15 seconds
  if (ev.score < 1000) continue; // 33184² → 1581² variants, 15 → 0.5 seconds

  filteredPerms.push([p, ev.score]);
}
console.log('Suitable for pairing:', filteredPerms.length);

// 2.3. Find two non-overlapping routes with max score

let maxScore2 = 0;
for (let i = 0; i < filteredPerms.length; i++) {
  for (let j = 0; j < i; j++) {
    const p1 = filteredPerms[i];
    const p2 = filteredPerms[j];
    if (p1[0].every(node => !p2[0].includes(node))) { // bitmasks would be faster, oh well
      maxScore2 = Math.max(maxScore2, p1[1] + p2[1]);
    }
  }
}
console.log('Max score:', maxScore2);

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

const evaluateRoute = (route) => route.reduce((acc, curr, i) => {
  const prev = route[i-1] || 'AA';
  const minutes = acc.minutes + distances[`${curr}-${prev}`];
  const score = acc.score + rates[curr] * (30 - minutes);
  return { score, minutes };
}, { score: 0, minutes: 0 });

let maxScore = 0;

const checkEveryPermutation = (list, pre = []) => {
  const r = [];

  for (let i = 0; i < list.length; i++) {
    const ancestors = [...pre, list[i]];
    const ev = evaluateRoute(ancestors);
    if (ev.minutes > 30) {
      continue; // variant list goes down from 15! to 280k items
    }
    maxScore = Math.max(maxScore, ev.score);

    const oneRemoved = [...list.slice(0, i), ...list.slice(i + 1)];
    const rest = checkEveryPermutation(oneRemoved, ancestors);
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

const permutations = checkEveryPermutation(nonZeroValves);
console.log(permutations.length);
console.log(maxScore);

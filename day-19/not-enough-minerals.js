const fs = require('fs');
const data = fs.readFileSync('input.txt', { encoding: 'utf8' });
const blueprints = data.trim().split(/\r?\n/)
  .map(b => [...b.match(/\d+/g)].map(n => +n))
  .map(m => ({
    ore: { ore: m[1] },
    clay: { ore: m[2] },
    obsidian: { ore: m[3], clay: m[4] },
    geode: { ore: m[5], obsidian: m[6] },
    maxNeeded: {
      ore: Math.max(m[1], m[2], m[3], m[5]),
      clay: m[4],
      obsidian: m[6],
      geode: Infinity,
    }
  }));

// Initial state
const fleet = { ore: 1, clay: 0, obsidian: 0, geode: 0 };
const resources = { ore: 0, clay: 0, obsidian: 0, geode: 0 };

// Helpers for visited states
const packKey = f => f.geode * 32*32*32 + f.obsidian * 32*32 + f.clay * 32 + f.ore;
const packValue = f => [f.geode, f.obsidian, f.clay, f.ore];
const seenBetter = (seen, met) => (
  seen[0] > met[0] || // More geodes is more geodes (this is a bit wrong, but we need this)
  seen[0] >= met[0] && seen[1] >= met[1] && seen[2] >= met[2] && seen[3] >= met[3]
);

const getVariants = (blueprint, { fleet, resources, minutes, declinedEarlier }) => {
  const variants = ['resources-only'];

  for (const t of ['ore', 'clay', 'obsidian', 'geode']) {
    // Don't build the robot you declined to build a minute ago (until you build something else)
    if (declinedEarlier.includes(t)) {
      continue;
    }

    // You'll never deplete resources these robots produce in the time you have
    if (fleet[t] * minutes + resources[t] >= blueprint.maxNeeded[t] * minutes) {
      continue;
    }

    // Not enough minerals for this robot
    if (Object.entries(blueprint[t]).some(([res, n]) => resources[res] < n)) {
      continue;
    }

    variants.push(t);
  }

  // If you can build a geode robot, don't build others (this is VERY wrong, but we NEED this)
  if (variants.includes('geode')) {
    return ['geode'];
  }

  return variants;
};

const liveOneMinute = (blueprint, { fleet, resources, minutes, declinedEarlier }, next) => {
  fleet = { ...fleet };
  resources = { ...resources };
  declinedEarlier = [...declinedEarlier];
  minutes--;

  // Mine resources
  for (const res in fleet) {
    resources[res] += fleet[res];
  }

  // Build a robot
  if (next !== 'resources-only') {
    for (const res in blueprint[next]) {
      resources[res] -= blueprint[next][res];
    }
    fleet[next]++;
    declinedEarlier = [];
  }

  return { fleet, resources, minutes, declinedEarlier };
};

const getBestProgram = (blueprint, minutes) => {
  let bestScore = 0;
  const visited = {};

  const queue = [{ fleet, resources, minutes, declinedEarlier: [] }];
  visited[packKey(resources)] = packValue(fleet);

  while (queue.length > 0) {
    const curr = queue.shift();

    if (curr.minutes === 0) {
      bestScore = Math.max(bestScore, curr.resources.geode);
      continue;
    }

    const variants = getVariants(blueprint, curr);

    for (const next of variants) {
      // Add non-chosen variants (except for "res-only") to the declined list of the chosen variant
      const declinedEarlier = [...curr.declinedEarlier, ...variants.filter(v => v !== 'resources-only' && v !== next)];

      // Live a minute
      const result = liveOneMinute(blueprint, { ...curr, declinedEarlier }, next);

      // Prune some branches
      const seen = visited[packKey(result.resources)];
      if (seen) {
        const met = packValue(result.fleet);
        if (seenBetter(seen, met)) {
          continue;
        }
      }

      // Queue the new state
      queue.push(result);
      visited[packKey(result.resources)] = packValue(result.fleet);
    }
  }

  return bestScore;
}

// --- Part One ---

const minutes = 24;
const sumOfLevels = blueprints.reduce((acc, b, i) => acc + (i+1) * getBestProgram(b, minutes), 0);
console.log(sumOfLevels);

// --- Part Two ---

const moreMinutes = 32;
const productOfThree = blueprints.slice(0, 3).reduce((acc, b) => acc * getBestProgram(b, moreMinutes), 1);
console.log(productOfThree);

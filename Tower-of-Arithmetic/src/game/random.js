// Small seeded random number helpers.
//
// The map is made from a "seed" number: the same seed always gives the same
// map. That makes a run easy to save (only the seed needs storing) and makes
// bugs easy to repeat. A new run uses a new seed, so every map is different.

// mulberry32: a tiny, fast pseudo-random generator.
// Returns a function that gives a new number from 0 (inclusive) to 1 (exclusive).
export function createRandom(seed) {
  let state = seed >>> 0;
  return function random() {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Roll a normal six-sided die: 1 to 6, each equally likely.
export function rollDie() {
  return 1 + Math.floor(Math.random() * 6);
}

// A fresh seed for a new run.
export function newSeed() {
  return Math.floor(Math.random() * 2 ** 31);
}

// Whole number from min to max (both included).
export function randomInt(random, min, max) {
  return min + Math.floor(random() * (max - min + 1));
}

// One item from a list.
export function pickOne(random, list) {
  return list[Math.floor(random() * list.length)];
}

// Mix up a list (returns a new list, the original is left alone).
export function shuffle(random, list) {
  const copy = [...list];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

// Pick a key using weights, e.g. { combat: 50, puzzle: 20 } picks combat
// two and a half times as often as puzzle. Keys with weight 0 are skipped.
export function pickWeighted(random, weights) {
  const entries = Object.entries(weights).filter(([, w]) => w > 0);
  const total = entries.reduce((sum, [, w]) => sum + w, 0);
  if (total === 0) return null;
  let roll = random() * total;
  for (const [key, weight] of entries) {
    roll -= weight;
    if (roll < 0) return key;
  }
  return entries[entries.length - 1][0];
}

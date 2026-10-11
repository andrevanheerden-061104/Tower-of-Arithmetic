// ---------------------------------------------------------------------------
// The run's pool of AI sums (run.questionPool), as sent by the server:
//   { algebra: { 1: [sum, sum], 2: [sum], 3: [sum] }, ... }
// by topic and difficulty level. run.questionsUsed counts how many of each
// list have been asked (see pickQuestion in questions.js). New batches are
// added to the END of each list, so the counts stay right.
// ---------------------------------------------------------------------------

const LEVELS = [1, 2, 3];

// Add a new batch to the pool the run already has.
export function mergePools(pool, more) {
  if (!more) return pool;
  const merged = { ...(pool ?? {}) };
  for (const [topic, levels] of Object.entries(more)) {
    merged[topic] = Object.fromEntries(LEVELS.map((level) => [level, [...(merged[topic]?.[level] ?? []), ...(levels?.[level] ?? [])]]));
  }
  return merged;
}

// Every sum in the pool, as shown (sent to the server so it doesn't make
// the same ones again).
export function poolDisplays(pool) {
  return Object.values(pool ?? {}).flatMap((levels) => LEVELS.flatMap((level) => (levels?.[level] ?? []).map((q) => q.display)));
}

// How many AI sums of a level haven't been asked yet (plain sums only: the
// word problems are kept for puzzle doors).
export function unusedInPool(run, level) {
  return Object.entries(run.questionPool ?? {}).reduce((total, [topic, levels]) => {
    const sums = (levels?.[level] ?? []).filter((q) => !q.story).length;
    return total + Math.max(0, sums - (run.questionsUsed?.[`${topic}:${level}:sum`] ?? 0));
  }, 0);
}

export function poolIsEmpty(pool) {
  return poolDisplays(pool).length === 0;
}

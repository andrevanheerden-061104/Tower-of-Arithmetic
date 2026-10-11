// ---------------------------------------------------------------------------
// Character levels
//
// Every character has their own level (1 to MAX_LEVEL). Playing a character
// will earn them XP and level them up (once the backend saves progress; for
// now every character is level 1, see `level` in characters.js).
//
// Every 5 levels the character gets a reward. To add one, add an entry to
// LEVEL_REWARDS below:
//
//   10: {
//     title: 'Upgraded starter',               short name for the reward
//     description: 'Start with a stronger...',  shown on the Characters screen
//     bonus: { ... },                           what it changes in a run
//   },
//
// Bonuses that the game understands so far:
//   maxHearts   extra hearts at the start of every run (and a higher max)
// To add a new kind of bonus, add it to NO_BONUS and use it in createRun
// (src/game/run.js).
// ---------------------------------------------------------------------------

export const MAX_LEVEL = 20;
export const REWARD_EVERY = 5; // a reward at levels 5, 10, 15 and 20

export const LEVEL_REWARDS = {
  5: {
    title: '+1 heart',
    description: 'Start every run with 1 extra heart.',
    bonus: { maxHearts: 1 },
  },
  // 10: { title: '...', description: '...', bonus: { ... } },
  // 15: { title: '...', description: '...', bonus: { ... } },
  // 20: { title: '...', description: '...', bonus: { ... } },
};

// Placeholder XP needed to go from `level` to the next one. Each level
// takes a little longer than the one before.
export function xpToNextLevel(level) {
  return level >= MAX_LEVEL ? 0 : 400 + (level - 1) * 100;
}

const NO_BONUS = { maxHearts: 0 };

// Every reward the character has reached, lowest level first.
export function rewardsReached(level) {
  return Object.entries(LEVEL_REWARDS)
    .map(([at, reward]) => ({ level: Number(at), ...reward }))
    .filter((reward) => reward.level <= level)
    .sort((a, b) => a.level - b.level);
}

// The next reward still to come (null when there are none left).
export function nextReward(level) {
  const ahead = Object.entries(LEVEL_REWARDS)
    .map(([at, reward]) => ({ level: Number(at), ...reward }))
    .filter((reward) => reward.level > level)
    .sort((a, b) => a.level - b.level);
  return ahead[0] ?? null;
}

// All the bonuses a character has at this level, added together.
export function levelBonus(level) {
  return rewardsReached(level).reduce((total, reward) => {
    const next = { ...total };
    for (const [key, value] of Object.entries(reward.bonus ?? {})) next[key] = (next[key] ?? 0) + value;
    return next;
  }, { ...NO_BONUS });
}

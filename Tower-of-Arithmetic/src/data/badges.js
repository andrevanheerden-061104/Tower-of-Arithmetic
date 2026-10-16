import { MAX_LEVEL } from './characterLevels';

// ---------------------------------------------------------------------------
// Badges
//
// Each badge unlocks when the player reaches its milestone. `earned` reads
// the player's totals:
//   runsCompleted     runs finished (won or lost)
//   highestFloor      the highest tower floor reached
//   topCharacterLevel the level of their highest-level character
//
// To add a badge: put its picture in src/assets/badges and add an entry.
// ---------------------------------------------------------------------------

export const BADGES = [
  {
    id: 'firstRun',
    name: 'First Run',
    description: 'Finish your first run of the tower.',
    image: require('../assets/badges/badge-first-run.png'),
    earned: (s) => s.runsCompleted >= 1,
  },
  {
    id: 'floor10',
    name: 'Floor 10',
    description: 'Reach floor 10 of the tower.',
    image: require('../assets/badges/badge-floor-10.png'),
    earned: (s) => s.highestFloor >= 10,
  },
  {
    id: 'maxLevel',
    name: 'Archmage',
    description: `Train a character all the way to level ${MAX_LEVEL}.`,
    image: require('../assets/badges/badge-charater-max-level.png'),
    earned: (s) => s.topCharacterLevel >= MAX_LEVEL,
  },
];

export function getBadge(id) {
  return BADGES.find((b) => b.id === id) ?? null;
}

// The ids of every badge these totals have unlocked
export function earnedBadgeIds(stats) {
  const s = { runsCompleted: 0, highestFloor: 0, topCharacterLevel: 1, ...stats };
  return BADGES.filter((b) => b.earned(s)).map((b) => b.id);
}

// The level of the player's highest-level character ({ shadow: { level } })
export function topCharacterLevel(characters) {
  return Math.max(1, ...Object.values(characters ?? {}).map((c) => c?.level ?? 1));
}

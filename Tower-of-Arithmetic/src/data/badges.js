import { MAX_LEVEL } from './characterLevels';
import { BOSS_IDS } from '../game/enemyAI';
import { VERSIONS } from '../game/versions';
import { hasLesson, lessonId } from './lessons';

// ---------------------------------------------------------------------------
// Badges
//
// Each badge unlocks when the player reaches its milestone. `earned` reads
// the player's totals:
//   runsCompleted     runs finished (won or lost)
//   highestFloor      the highest tower floor reached
//   topCharacterLevel the level of their highest-level character
//   perfectFloor      won a floor with every sum right (ever)
//   noHintFloor       won a floor without using a hint (ever)
//   bossesBeaten      the ids of every boss they have beaten
//   lessonsDone       Spell School lessons finished ('senior:algebra')
//   versionId         their version, for Spell Scholar
//
// The feats are kept in the player's settings as `feats` (see badgeStats).
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
    id: 'floor20',
    name: 'Floor 20',
    description: 'Reach floor 20 of the tower.',
    image: require('../assets/badges/badge-floor-20.png'),
    earned: (s) => s.highestFloor >= 20,
  },
  {
    id: 'purePath',
    name: 'The Pure Path',
    description: 'Clear a floor without using a single hint.',
    image: require('../assets/badges/badge-no-hint-run.png'),
    earned: (s) => s.noHintFloor,
  },
  {
    id: 'perfectFloor',
    name: 'Perfect Floor',
    description: 'Clear a floor with no wrong answers.',
    image: require('../assets/badges/badge-perfect-run.png'),
    earned: (s) => s.perfectFloor,
  },
  {
    id: 'spellScholar',
    name: 'Spell Scholar',
    description: 'Finish every Spell School lesson for your grade.',
    image: require('../assets/badges/badge-spell-school.png'),
    earned: (s) => allLessonsDone(s.versionId, s.lessonsDone),
  },
  {
    id: 'bossSlayer',
    name: 'Boss Slayer',
    description: 'Defeat every boss in the tower.',
    image: require('../assets/badges/badge-boss-slayer.png'),
    earned: (s) => BOSS_IDS.every((id) => s.bossesBeaten.includes(id)),
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

function allLessonsDone(versionId, done) {
  const version = VERSIONS[versionId];
  if (!version) return false;
  return version.dungeonTypes.filter((t) => hasLesson(versionId, t.id)).every((t) => done.includes(lessonId(versionId, t.id)));
}

// Everything the badges read, from the totals, the saved settings (feats
// and lessons) and the run going now (its floor and feats)
export function badgeStats({ runsCompleted = 0, highestFloor = 0, characters, settings, versionId, run, runFloor = 0 }) {
  const saved = settings?.feats ?? {};
  const now = run?.feats ?? {};
  return {
    runsCompleted,
    highestFloor: Math.max(highestFloor, runFloor),
    topCharacterLevel: topCharacterLevel(characters),
    perfectFloor: Boolean(saved.perfectFloor || now.perfectFloor),
    noHintFloor: Boolean(saved.noHintFloor || now.noHintFloor),
    bossesBeaten: [...new Set([...(saved.bossesBeaten ?? []), ...(now.bossesBeaten ?? [])])],
    lessonsDone: settings?.lessonsDone ?? [],
    versionId,
  };
}

// The saved feats with this run's added, or null when nothing is new
export function newFeats(settings, run) {
  if (!run?.feats) return null;
  const saved = { perfectFloor: false, noHintFloor: false, bossesBeaten: [], ...settings?.feats };
  const merged = {
    perfectFloor: saved.perfectFloor || run.feats.perfectFloor,
    noHintFloor: saved.noHintFloor || run.feats.noHintFloor,
    bossesBeaten: [...new Set([...saved.bossesBeaten, ...run.feats.bossesBeaten])],
  };
  const changed =
    merged.perfectFloor !== saved.perfectFloor || merged.noHintFloor !== saved.noHintFloor || merged.bossesBeaten.length !== saved.bossesBeaten.length;
  return changed ? merged : null;
}

// The ids of every badge these totals have unlocked
export function earnedBadgeIds(stats) {
  const s = { runsCompleted: 0, highestFloor: 0, topCharacterLevel: 1, perfectFloor: false, noHintFloor: false, bossesBeaten: [], lessonsDone: [], ...stats };
  return BADGES.filter((b) => b.earned(s)).map((b) => b.id);
}

// The level of the player's highest-level character ({ shadow: { level } })
export function topCharacterLevel(characters) {
  return Math.max(1, ...Object.values(characters ?? {}).map((c) => c?.level ?? 1));
}

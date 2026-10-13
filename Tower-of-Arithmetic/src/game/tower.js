import { createRandom } from './random';

// ---------------------------------------------------------------------------
// The tower is climbed in parts ("climbs"). One climb is the version's
// floors (10 for senior, 8 for intermediate, 5 for junior) with a boss on
// top. After beating a boss the player may climb on, up to MAX_CLIMBS times
// (so a senior tower is 30 floors high). Each climb is harder:
//   climb 2   enemies +1 heart, more level 2 enemies, bosses +2 hearts
//   climb 3   enemies +2 hearts, only level 2 enemies, bosses +4 hearts,
//             and every attack hits ½ heart harder
// Rewards grow too (see CLIMB_REWARD).
//
// Each climb has its own map with its own seed, so the rooms, enemies,
// backgrounds and boss are different every time.
// ---------------------------------------------------------------------------

export const MAX_CLIMBS = 3;

export const CLIMBS = {
  1: { enemyHearts: 0, bossHearts: 0, attack: 0, reward: 1 },
  2: { enemyHearts: 1, bossHearts: 2, attack: 0, reward: 1.5 },
  3: { enemyHearts: 2, bossHearts: 4, attack: 0.5, reward: 2 },
};

export const climbOf = (run) => run.climb ?? 1;
export const climbRules = (run) => CLIMBS[climbOf(run)] ?? CLIMBS[MAX_CLIMBS];

// A map floor (1-10) as a floor of the whole tower (1-30).
export function towerFloor(run, floor) {
  return (climbOf(run) - 1) * run.map.floors + Math.max(0, floor);
}

// The top floor of the climb the player is on (10, 20 or 30 for senior).
export const towerTop = (run) => climbOf(run) * run.map.floors;

// The highest the tower goes for this version (30 for senior).
export const towerHeight = (run) => MAX_CLIMBS * run.map.floors;

export const canClimbOn = (run) => climbOf(run) < MAX_CLIMBS;

// --- random picks that stay the same for a room ------------------------------

export function hashString(text) {
  let h = 2166136261;
  for (let i = 0; i < text.length; i++) h = Math.imul(h ^ text.charCodeAt(i), 16777619);
  return h >>> 0;
}

// A random number generator for one room of this climb (same answer every
// time the room is shown).
export function roomRandom(run, roomId, salt = '') {
  return createRandom((run.map.seed ^ hashString(`${roomId}${salt}`)) >>> 0);
}

const pick = (random, list) => list[Math.floor(random() * list.length)];

// Backgrounds (keys of BACKGROUNDS in src/components/run/RunBackground.js)
export const FLOOR_BACKGROUNDS = ['corridor', 'corridorMoon', 'corridorLibrary'];
export const BOSS_BACKGROUNDS = ['bossDoor', 'bossThrone'];

// The corridor picture for a fight or puzzle room.
export function floorBackground(run, roomId = run.currentId) {
  return pick(roomRandom(run, roomId, 'background'), FLOOR_BACKGROUNDS);
}

// Which event waits in a mystery room.
export const MYSTERY_EVENTS = ['ghost', 'librarian'];
export function mysteryEvent(run, roomId = run.currentId) {
  return pick(roomRandom(run, roomId, 'event'), MYSTERY_EVENTS);
}

// The boss for a new climb: one not met yet this run when possible.
export function chooseBoss(seed, bossIds, seen = []) {
  const fresh = bossIds.filter((id) => !seen.includes(id));
  const random = createRandom((seed ^ 0x5bd1e995) >>> 0);
  return {
    id: pick(random, fresh.length ? fresh : bossIds),
    background: pick(random, BOSS_BACKGROUNDS),
  };
}

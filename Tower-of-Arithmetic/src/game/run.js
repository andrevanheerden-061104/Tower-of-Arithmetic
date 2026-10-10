import { ENEMIES, ITEMS } from './encounters';
import { pickEnemyId } from './enemyAI';
import { generateMap } from './mapGenerator';
import { newSeed } from './random';
import { REWARD_ROOMS, ROOMS } from './rooms';
import { MAX_DECK } from './spells';
import { VERSIONS } from './versions';

// ---------------------------------------------------------------------------
// The current run (one climb of the tower).
//
// App.js keeps the run in state and hands it to the tower screens. Screens
// never change it directly: they call updateRun(fn) with one of the helpers
// below, which each return a NEW run object. Nothing is saved to the phone
// or a server yet, so a run is lost when the app closes.
// ---------------------------------------------------------------------------

export function createRun({ version, dungeonTypeId, character }) {
  const seed = newSeed();
  return {
    versionId: version.id,
    dungeonTypeId,
    seed,
    map: generateMap({ floors: version.floors, seed, roomTypes: version.rooms }),
    currentId: 'start',  // the room the player is in (start = tower gate)
    cleared: ['start'],
    hearts: version.hearts,
    maxHearts: version.hearts,
    coins: version.startCoins,
    xp: 0,
    // The player starts with only their character's level 1 card and
    // collects the rest on the way up.
    deck: [character?.starter ?? 'shadowShard'],
    potions: version.usesPotions ? ['heal', 'power'] : [],
    items: version.usesCurses ? ['luckyGem', 'hauntedRing'] : version.usesCoins ? ['luckyGem'] : [],
    cleansed: [],   // items whose curse was removed at a campfire
    stats: { solved: 0, hints: 0, errors: 0, streak: 0, bestStreak: 0, floors: [] },
    reward: null,   // what the reward screen will show
    status: 'active', // 'active' | 'won' | 'lost'
  };
}

export function runVersion(run) {
  return VERSIONS[run.versionId];
}

export function currentRoom(run) {
  return run.map.nodes[run.currentId];
}

// Which screen opens for a room type.
export function screenForRoom(type) {
  return ROOMS[type]?.screen ?? 'pathMap';
}

// The enemy in the room the player is in (level depends on the floor,
// see pickEnemyId in src/game/enemyAI.js).
export function enemyForRun(run) {
  return ENEMIES[pickEnemyId(run.seed, currentRoom(run), run.map.floors)];
}

export function enterRoom(run, roomId) {
  return { ...run, currentId: roomId };
}

// Mark the room the player is in as done.
export function clearRoom(run) {
  if (run.cleared.includes(run.currentId)) return run;
  return { ...run, cleared: [...run.cleared, run.currentId] };
}

export function heal(run, amount) {
  return { ...run, hearts: Math.min(run.maxHearts, run.hearts + amount) };
}

export function damage(run, amount) {
  const hearts = Math.max(0, run.hearts - amount);
  return { ...run, hearts, status: hearts <= 0 ? 'lost' : run.status };
}

export function addCoins(run, amount) {
  return { ...run, coins: Math.max(0, run.coins + amount) };
}

export function addSpell(run, spellId) {
  if (run.deck.length >= MAX_DECK) return run;
  return { ...run, deck: [...run.deck, spellId] };
}

export function addItem(run, itemId) {
  return { ...run, items: [...run.items, itemId] };
}

export function drinkPotion(run, index) {
  const potion = run.potions[index];
  if (!potion) return run;
  const potions = run.potions.filter((_, i) => i !== index);
  const next = { ...run, potions };
  return potion === 'heal' ? heal(next, 0.5) : next;
}

export function addPotion(run, potionId) {
  return { ...run, potions: [...run.potions, potionId].slice(0, 4) };
}

// The item stays and keeps its power; only its curse is lifted.
export function removeCurse(run, itemId) {
  return { ...run, cleansed: [...run.cleansed, itemId] };
}

export function isCursed(run, itemId) {
  return Boolean(ITEMS[itemId]?.cursed) && !run.cleansed.includes(itemId);
}

export function cursedItems(run) {
  return run.items.filter((id) => isCursed(run, id)).map((id) => ITEMS[id]);
}

// Count answers for the run stats screen.
export function recordAnswer(run, { correct, hintsUsed = 0 }) {
  const floor = currentRoom(run).floor;
  const stats = { ...run.stats };
  stats.hints += hintsUsed;
  if (correct) {
    stats.solved += 1;
    stats.streak += 1;
    stats.bestStreak = Math.max(stats.bestStreak, stats.streak);
  } else {
    stats.errors += 1;
    stats.streak = 0;
  }
  const floors = [...stats.floors];
  const i = floors.findIndex((f) => f.floor === floor);
  const entry = i >= 0 ? { ...floors[i] } : { floor, correct: 0, total: 0 };
  entry.total += 1;
  if (correct) entry.correct += 1;
  if (i >= 0) floors[i] = entry;
  else floors.push(entry);
  stats.floors = floors;
  return { ...run, stats };
}

// Rewards for finishing a fight, puzzle or the boss (placeholder amounts).
export function makeReward(run, roomType) {
  const version = runVersion(run);
  const boss = roomType === 'boss';
  return {
    roomType,
    floor: currentRoom(run).floor,
    towerCleared: boss,
    xp: boss ? 300 : roomType === 'puzzle' ? 80 : 120,
    coins: version.usesCoins ? (boss ? 50 : 15) : 0,
    potion: version.usesPotions && roomType === 'combat' ? 'heal' : null,
    spellChoice: !boss,
    spellTaken: false,
  };
}

// Give the player the reward and remember it for the reward screen.
export function grantReward(run, roomType) {
  const reward = makeReward(run, roomType);
  let next = { ...clearRoom(run), reward, xp: run.xp + reward.xp };
  next = addCoins(next, reward.coins);
  if (reward.potion) next = addPotion(next, reward.potion);
  if (reward.towerCleared) next.status = 'won';
  return next;
}

export function needsReward(roomType) {
  return REWARD_ROOMS.includes(roomType);
}

// How many floors are done (for progress bars).
export function floorsCleared(run) {
  return Math.max(0, ...run.cleared.map((id) => run.map.nodes[id].floor));
}

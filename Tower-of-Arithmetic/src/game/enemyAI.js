import { createRandom, pickWeighted, rollDie } from './random';

// ---------------------------------------------------------------------------
// Enemy combat scripts
//
// A fight goes in rounds:
//   1. Player's turn: pick a spell and solve its sum. Right = the spell
//      works, wrong = it fizzles.
//   2. Enemy's turn: the enemy acts by its script below.
// The player is never told what the enemy will do; each action is
// explained only when it happens.
//
// Level 1 enemies (Slime, Pumpkin, Book Mimic, Crystal Crawler) follow a
// fixed pattern.
// Level 2 enemies (Dark Owl, Fire Lizard, Frost Wyvern, Glass Knight) pick
// their attacks at random, so they can't be predicted. The only rule they
// always follow: they heal 1 heart once per fight when they drop to half
// health or less.
// Bosses (Morvath, Marionetta, the Shadow of Merlin) repeat a pattern of
// three moves and heal a few times when they drop to half health.
//
// Every enemy has a hidden weakness. Spells of that element do double
// damage and show "Critical hit!" (the weakness itself is never named).
//
// Every number lives in ACTIONS, ENEMY_RULES and SCRIPTS below, so
// balancing the game means changing numbers here, not the screens.
// ---------------------------------------------------------------------------

// Everything an enemy can do.
//   kind     attack | boost | heal | idle
//   text     what an idle move says ("… and does nothing!" is added)
//   amount   hearts of damage, boost or healing
//   maxUses  how many times per fight (leave out for unlimited)
//   element  what an attack is made of (fire, ice or shadow), if anything:
//            the player's rings and veil block part of it
export const ACTIONS = {
  // Slime (level 1)
  slimeBoost: { id: 'slimeBoost', kind: 'boost', name: 'Bubble up', amount: 0.5 },
  waterAttack: { id: 'waterAttack', kind: 'attack', name: 'Water splash', amount: 0.5, element: 'ice' },

  // Pumpkin (level 1)
  vineWhip: { id: 'vineWhip', kind: 'attack', name: 'Vine whip', amount: 0.5 },
  pumpkinYawn: { id: 'pumpkinYawn', kind: 'idle', name: 'Big yawn', amount: 0 },
  pumpkinSlam: { id: 'pumpkinSlam', kind: 'attack', name: 'Pumpkin slam', amount: 1 },

  // Dark Owl (level 2)
  shadowPeck: { id: 'shadowPeck', kind: 'attack', name: 'Shadow peck', amount: 0.5, element: 'shadow' },
  nightDive: { id: 'nightDive', kind: 'attack', name: 'Night dive', amount: 1, element: 'shadow' },
  hauntingHoot: { id: 'hauntingHoot', kind: 'boost', name: 'Haunting hoot', amount: 0.5 },
  moonlitRest: { id: 'moonlitRest', kind: 'heal', name: 'Moonlit rest', amount: 1, maxUses: 1 },

  // Fire Lizard (level 2)
  tailSwipe: { id: 'tailSwipe', kind: 'attack', name: 'Tail swipe', amount: 0.5 },
  fireBreath: { id: 'fireBreath', kind: 'attack', name: 'Fire breath', amount: 1.5, element: 'fire' },
  heatUp: { id: 'heatUp', kind: 'boost', name: 'Heat up', amount: 0.5 },
  baskInFlames: { id: 'baskInFlames', kind: 'heal', name: 'Bask in the flames', amount: 1, maxUses: 1 },

  // Morvath, the Shadow Warden (boss)
  shadowStrike: { id: 'shadowStrike', kind: 'attack', name: 'Shadow strike', amount: 0.5, element: 'shadow' },
  shadowCrush: { id: 'shadowCrush', kind: 'attack', name: 'Shadow crush', amount: 2, maxUses: 3, element: 'shadow' },
  darkMend: { id: 'darkMend', kind: 'heal', name: 'Dark mend', amount: 1, maxUses: 3 },
  wardenFocus: { id: 'wardenFocus', kind: 'boost', name: 'Warden’s focus', amount: 0.5 },

  // Book Mimic (level 1)
  paperCut: { id: 'paperCut', kind: 'attack', name: 'Paper cut', amount: 0.5 },
  snapShut: { id: 'snapShut', kind: 'attack', name: 'Snap shut', amount: 1 },
  readAPage: { id: 'readAPage', kind: 'idle', name: 'Read a page', amount: 0, text: 'stops to read one of its own pages' },

  // Crystal Crawler (level 1)
  crystalShine: { id: 'crystalShine', kind: 'boost', name: 'Crystal shine', amount: 0.5 },
  pincerSnap: { id: 'pincerSnap', kind: 'attack', name: 'Pincer snap', amount: 0.5 },
  shardSpray: { id: 'shardSpray', kind: 'attack', name: 'Shard spray', amount: 0.5, element: 'ice' },

  // Frost Wyvern (level 2)
  frostBite: { id: 'frostBite', kind: 'attack', name: 'Frost bite', amount: 0.5, element: 'ice' },
  iceBreath: { id: 'iceBreath', kind: 'attack', name: 'Ice breath', amount: 1, element: 'ice' },
  wingGust: { id: 'wingGust', kind: 'boost', name: 'Wing gust', amount: 0.5 },
  frozenRest: { id: 'frozenRest', kind: 'heal', name: 'Frozen rest', amount: 1, maxUses: 1 },

  // Glass Knight (level 2)
  glassSlash: { id: 'glassSlash', kind: 'attack', name: 'Glass slash', amount: 0.5 },
  shatterLance: { id: 'shatterLance', kind: 'attack', name: 'Shatter lance', amount: 1 },
  prismGuard: { id: 'prismGuard', kind: 'boost', name: 'Prism glow', amount: 0.5 },
  mendTheGlass: { id: 'mendTheGlass', kind: 'heal', name: 'Mend the glass', amount: 1, maxUses: 1 },

  // Marionetta, the Puppet Queen (boss)
  stringLash: { id: 'stringLash', kind: 'attack', name: 'String lash', amount: 0.5 },
  pullTheStrings: { id: 'pullTheStrings', kind: 'boost', name: 'Pull the strings', amount: 1 },
  sixArmStrike: { id: 'sixArmStrike', kind: 'attack', name: 'Six-arm strike', amount: 1, maxUses: 4 },
  restitch: { id: 'restitch', kind: 'heal', name: 'Restitch', amount: 1, maxUses: 2 },

  // The Shadow of Merlin, the Starless Sage (boss)
  fallingStar: { id: 'fallingStar', kind: 'attack', name: 'Falling star', amount: 0.5 },
  cosmicGaze: { id: 'cosmicGaze', kind: 'boost', name: 'Cosmic gaze', amount: 0.5 },
  voidBolt: { id: 'voidBolt', kind: 'attack', name: 'Void bolt', amount: 1.5, maxUses: 3, element: 'shadow' },
  starlightMend: { id: 'starlightMend', kind: 'heal', name: 'Starlight mend', amount: 1, maxUses: 3 },
};

// Hidden weakness of each enemy (spells of this element do double damage).
export const WEAKNESS = {
  slime: 'ice', // made of water
  pumpkin: 'fire', // a plant
  darkOwl: 'light', // a creature of the night
  fireLizard: 'ice',
  morvath: 'light',
  bookMimic: 'fire', // paper burns
  crystalCrawler: 'shadow', // crystals go dull without light
  frostWyvern: 'fire',
  glassKnight: 'shadow', // stained glass is made of light
  marionetta: 'fire', // her strings burn
  merlinShadow: 'light',
};

// Weighted random pick for the level 2 enemies. Big attacks never come
// twice in a row, and a boost isn't used while one is already waiting.
function randomAction(state, weights, big) {
  const allowed = { ...weights };
  if (state.last === big) delete allowed[big];
  for (const id of Object.keys(allowed)) {
    if (ACTIONS[id].kind === 'boost' && state.boost > 0) delete allowed[id];
  }
  return pickWeighted(Math.random, allowed);
}

// Heal once (or up to maxUses) when at half health or less.
function wantsHeal(state, healId) {
  return state.hearts <= state.max / 2 && state.hearts < state.max && canUse(state, healId) && state.last !== healId;
}

// How each enemy picks its next action.
export const SCRIPTS = {
  // Repeats: boost, boosted splash (1 heart), splash (½ heart).
  slime: (state) => ['slimeBoost', 'waterAttack', 'waterAttack'][state.cycle % 3],

  // Repeats: vine whip (½), a lazy yawn (nothing), pumpkin slam (1).
  pumpkin: (state) => ['vineWhip', 'pumpkinYawn', 'pumpkinSlam'][state.cycle % 3],

  // Random: mostly pecks, sometimes a dive, now and then a hoot (boost).
  darkOwl: (state) =>
    wantsHeal(state, 'moonlitRest')
      ? 'moonlitRest'
      : randomAction(state, { shadowPeck: 3, nightDive: 2, hauntingHoot: 1 }, 'nightDive'),

  // Random: mostly tail swipes, sometimes heats up, rarely a big fire breath.
  fireLizard: (state) =>
    wantsHeal(state, 'baskInFlames')
      ? 'baskInFlames'
      : randomAction(state, { tailSwipe: 3, heatUp: 2, fireBreath: 1 }, 'fireBreath'),

  // Morvath heals at half health (3 times per fight, never twice in a row),
  // otherwise repeats: Shadow strike, Warden's focus, Shadow crush
  // (3 times per fight, then Shadow strike instead).
  morvath: (state) => {
    if (wantsHeal(state, 'darkMend')) return 'darkMend';
    const id = ['shadowStrike', 'wardenFocus', 'shadowCrush'][state.cycle % 3];
    return canUse(state, id) ? id : 'shadowStrike';
  },

  // Repeats: paper cut (½), a lazy read (nothing), snap shut (1).
  bookMimic: (state) => ['paperCut', 'readAPage', 'snapShut'][state.cycle % 3],

  // Repeats: shine (boost), boosted pincer snap (1 heart), shard spray (½).
  crystalCrawler: (state) => ['crystalShine', 'pincerSnap', 'shardSpray'][state.cycle % 3],

  // Random: mostly frost bites, sometimes a wing gust, now and then ice breath.
  frostWyvern: (state) =>
    wantsHeal(state, 'frozenRest') ? 'frozenRest' : randomAction(state, { frostBite: 3, wingGust: 2, iceBreath: 1 }, 'iceBreath'),

  // Random: mostly slashes, sometimes glows (boost), now and then a lance.
  glassKnight: (state) =>
    wantsHeal(state, 'mendTheGlass') ? 'mendTheGlass' : randomAction(state, { glassSlash: 3, prismGuard: 2, shatterLance: 1 }, 'shatterLance'),

  // Marionetta restitches at half health (twice per fight), otherwise
  // repeats: String lash, Pull the strings (+1 heart on her next attack),
  // Six-arm strike (4 times per fight, then String lash instead).
  marionetta: (state) => {
    if (wantsHeal(state, 'restitch')) return 'restitch';
    const id = ['stringLash', 'pullTheStrings', 'sixArmStrike'][state.cycle % 3];
    return canUse(state, id) ? id : 'stringLash';
  },

  // The Shadow of Merlin heals at half health (3 times per fight), otherwise
  // repeats: Falling star, Cosmic gaze (boost), Void bolt (3 times per
  // fight, then Falling star instead).
  merlinShadow: (state) => {
    if (wantsHeal(state, 'starlightMend')) return 'starlightMend';
    const id = ['fallingStar', 'cosmicGaze', 'voidBolt'][state.cycle % 3];
    return canUse(state, id) ? id : 'fallingStar';
  },
};

function canUse(state, actionId) {
  const max = ACTIONS[actionId].maxUses;
  return max == null || (state.uses[actionId] ?? 0) < max;
}

// Who acts first in a fight. A hidden six-sided die is rolled once at the
// start: 1-3 the enemy goes first, 4-6 the player goes first.
export function rollForFirstTurn() {
  const roll = rollDie();
  return { roll, first: roll <= 3 ? 'enemy' : 'player' };
}

// A fresh enemy at the start of a fight. `power` is extra damage on every
// attack (the third climb of the tower hits harder, see src/game/tower.js).
export function createEnemyState(enemy) {
  return {
    id: enemy.id,
    hearts: enemy.hearts,
    max: enemy.hearts,
    power: enemy.power ?? 0,
    boost: 0, // extra damage added to its next attack
    turn: 0, // how many turns it has taken
    cycle: 0, // position in its pattern (heals don't move it on)
    uses: {}, // times each limited action was used
    last: null, // its last action
  };
}

// Do the enemy's turn. Returns its new state, the damage dealt to the
// player and a line of text describing what happened.
export function takeTurn(state, enemyName) {
  const action = ACTIONS[SCRIPTS[state.id](state)];
  const next = {
    ...state,
    turn: state.turn + 1,
    cycle: action.kind === 'heal' ? state.cycle : state.cycle + 1,
    uses: { ...state.uses, [action.id]: (state.uses[action.id] ?? 0) + 1 },
    last: action.id,
  };
  let damage = 0;
  let message;

  if (action.kind === 'boost') {
    next.boost = state.boost + action.amount;
    message = `${enemyName} uses ${action.name}! Its next attack deals +${hearts(action.amount)}.`;
  } else if (action.kind === 'heal') {
    next.hearts = Math.min(state.max, state.hearts + action.amount);
    message = `${enemyName} uses ${action.name} and heals ${hearts(next.hearts - state.hearts)}.`;
  } else if (action.kind === 'idle') {
    message = action.text
      ? `${enemyName} ${action.text}… and does nothing!`
      : `${enemyName} lets out a ${action.name.toLowerCase()}… and does nothing!`;
  } else {
    damage = action.amount + state.boost + (state.power ?? 0);
    next.boost = 0;
    message = `${enemyName} uses ${action.name}! You lose ${hearts(damage)}.`;
  }
  return { state: next, damage, message, action };
}

// How much a spell does to this enemy. Parts that match the enemy's
// weakness do double damage. `bonus` (e.g. the Scroll of Sharpened Spells) adds to the
// first part.
export function spellDamage(spell, enemyId, bonus = 0) {
  const weak = WEAKNESS[enemyId];
  let amount = 0;
  let crit = false;
  (spell.hits ?? []).forEach((hit, i) => {
    let part = hit.amount + (i === 0 ? bonus : 0);
    if (hit.element === weak) {
      part *= 2;
      crit = true;
    }
    amount += part;
  });
  return { amount, crit };
}

// The enemy is hit by a spell.
export function hitEnemy(state, amount) {
  return { ...state, hearts: Math.max(0, state.hearts - amount) };
}

// ---------------------------------------------------------------------------
// Which enemy is in a room
//
// Level 1 enemies fill the lower floors and level 2 enemies the higher
// ones; which one of its level is random. On the first climb the chance
// of a level 2 enemy rises the higher the player gets:
//   bottom 25% of the climb   always level 1
//   25% - 75%                 level 2 chance grows from 0% to 100%
//   top 25%                   always level 2
// On the second climb it starts at 50%, and on the third it's always level 2.
// The pick comes from the climb's map seed and the room, so it stays the
// same if the player leaves to the main menu and comes back.
// The boss of each climb is picked at random from BOSS_IDS (src/game/run.js).
// ---------------------------------------------------------------------------
export const ENEMY_LEVELS = {
  1: ['slime', 'pumpkin', 'bookMimic', 'crystalCrawler'],
  2: ['darkOwl', 'fireLizard', 'frostWyvern', 'glassKnight'],
};

export const BOSS_IDS = ['morvath', 'marionetta', 'merlinShadow'];

export function pickEnemyId(seed, room, floors, climb = 1) {
  const random = createRandom((seed ^ hashString(room.id)) >>> 0);
  const progress = floors > 2 ? (room.floor - 1) / (floors - 2) : 0; // 0 on floor 1, 1 just before the boss
  const ramp = Math.min(1, Math.max(0, (progress - 0.25) / 0.5));
  const level2Chance = climb >= 3 ? 1 : climb === 2 ? 0.5 + ramp / 2 : ramp;
  const level = random() < level2Chance ? 2 : 1;
  const list = ENEMY_LEVELS[level];
  return list[Math.floor(random() * list.length)];
}

function hashString(text) {
  let h = 2166136261;
  for (let i = 0; i < text.length; i++) h = Math.imul(h ^ text.charCodeAt(i), 16777619);
  return h >>> 0;
}

// 0.5 -> "½ heart", 1 -> "1 heart", 1.5 -> "1½ hearts"
export function hearts(value) {
  const whole = Math.floor(value);
  const half = value - whole >= 0.5 ? '½' : '';
  const text = whole === 0 ? half : `${whole}${half}`;
  return `${text} ${value > 1 ? 'hearts' : 'heart'}`;
}

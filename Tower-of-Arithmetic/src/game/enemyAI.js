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
// Level 1 enemies (Slime, Pumpkin) follow a fixed pattern.
// Level 2 enemies (Dark Owl, Fire Lizard) pick their attacks at random, so
// they can't be predicted. The only rule they always follow: they heal
// 1 heart once per fight when they drop to half health or less.
//
// Every enemy has a hidden weakness. Spells of that element do double
// damage and show "Critical hit!" (the weakness itself is never named).
//
// Every number lives in ACTIONS, ENEMY_RULES and SCRIPTS below, so
// balancing the game means changing numbers here, not the screens.
// ---------------------------------------------------------------------------

// Everything an enemy can do.
//   kind     attack | boost | heal | idle
//   amount   hearts of damage, boost or healing
//   maxUses  how many times per fight (leave out for unlimited)
export const ACTIONS = {
  // Slime (level 1)
  slimeBoost: { id: 'slimeBoost', kind: 'boost', name: 'Bubble up', amount: 0.5 },
  waterAttack: { id: 'waterAttack', kind: 'attack', name: 'Water splash', amount: 0.5 },

  // Pumpkin (level 1)
  vineWhip: { id: 'vineWhip', kind: 'attack', name: 'Vine whip', amount: 0.5 },
  pumpkinYawn: { id: 'pumpkinYawn', kind: 'idle', name: 'Big yawn', amount: 0 },
  pumpkinSlam: { id: 'pumpkinSlam', kind: 'attack', name: 'Pumpkin slam', amount: 1 },

  // Dark Owl (level 2)
  shadowPeck: { id: 'shadowPeck', kind: 'attack', name: 'Shadow peck', amount: 0.5 },
  nightDive: { id: 'nightDive', kind: 'attack', name: 'Night dive', amount: 1 },
  hauntingHoot: { id: 'hauntingHoot', kind: 'boost', name: 'Haunting hoot', amount: 0.5 },
  moonlitRest: { id: 'moonlitRest', kind: 'heal', name: 'Moonlit rest', amount: 1, maxUses: 1 },

  // Fire Lizard (level 2)
  tailSwipe: { id: 'tailSwipe', kind: 'attack', name: 'Tail swipe', amount: 0.5 },
  fireBreath: { id: 'fireBreath', kind: 'attack', name: 'Fire breath', amount: 1.5 },
  heatUp: { id: 'heatUp', kind: 'boost', name: 'Heat up', amount: 0.5 },
  baskInFlames: { id: 'baskInFlames', kind: 'heal', name: 'Bask in the flames', amount: 1, maxUses: 1 },

  // Morvath, the Shadow Warden (boss)
  shadowStrike: { id: 'shadowStrike', kind: 'attack', name: 'Shadow strike', amount: 0.5 },
  shadowCrush: { id: 'shadowCrush', kind: 'attack', name: 'Shadow crush', amount: 2, maxUses: 3 },
  darkMend: { id: 'darkMend', kind: 'heal', name: 'Dark mend', amount: 1, maxUses: 3 },
  wardenFocus: { id: 'wardenFocus', kind: 'boost', name: 'Warden’s focus', amount: 0.5 },
};

// Hidden weakness of each enemy (spells of this element do double damage).
export const WEAKNESS = {
  slime: 'ice', // made of water
  pumpkin: 'fire', // a plant
  darkOwl: 'light', // a creature of the night
  fireLizard: 'ice',
  morvath: 'light',
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

// A fresh enemy at the start of a fight.
export function createEnemyState(enemy) {
  return {
    id: enemy.id,
    hearts: enemy.hearts,
    max: enemy.hearts,
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
    message = `${enemyName} lets out a ${action.name.toLowerCase()}… and does nothing!`;
  } else {
    damage = action.amount + state.boost;
    next.boost = 0;
    message = `${enemyName} uses ${action.name}! You lose ${hearts(damage)}.`;
  }
  return { state: next, damage, message, action };
}

// How much a spell does to this enemy. Parts that match the enemy's
// weakness do double damage. `bonus` (e.g. the haunted ring) adds to the
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
// Level 1 enemies (Slime, Pumpkin) fill the lower floors and level 2
// enemies (Dark Owl, Fire Lizard) the higher ones. In between, the chance
// of a level 2 enemy rises the higher the player climbs:
//   bottom 25% of the tower   always level 1
//   25% - 75%                 level 2 chance grows from 0% to 100%
//   top 25%                   always level 2
// The pick comes from the run's seed and the room, so it stays the same if
// the player leaves to the main menu and comes back.
// ---------------------------------------------------------------------------
export const ENEMY_LEVELS = {
  1: ['slime', 'pumpkin'],
  2: ['darkOwl', 'fireLizard'],
};

export function pickEnemyId(seed, room, floors) {
  if (room.type === 'boss') return 'morvath';
  const random = createRandom((seed ^ hashString(room.id)) >>> 0);
  const progress = floors > 2 ? (room.floor - 1) / (floors - 2) : 0; // 0 on floor 1, 1 just before the boss
  const level2Chance = Math.min(1, Math.max(0, (progress - 0.25) / 0.5));
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

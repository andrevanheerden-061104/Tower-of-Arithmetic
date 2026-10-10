import { rollDie } from './random';

// ---------------------------------------------------------------------------
// Enemy combat scripts
//
// A fight goes in rounds:
//   1. Player's turn: pick a spell and solve its sum. Right = the spell hits,
//      wrong = the spell fizzles.
//   2. Enemy's turn: the enemy does the action it showed as its "intent".
//
// The enemy always shows what it will do next (like Slay the Spire), so the
// player can plan, e.g. drink a heal potion before a big hit.
//
// Every number lives in ACTIONS and SCRIPTS below, so balancing the game
// means changing numbers here, not the screens.
// ---------------------------------------------------------------------------

// Everything an enemy can do.
//   kind     attack | boost | heal
//   amount   hearts of damage, boost or healing
//   maxUses  how many times per fight (leave out for unlimited)
export const ACTIONS = {
  // Slime
  slimeBoost: { id: 'slimeBoost', kind: 'boost', name: 'Bubble up', amount: 0.5 },
  waterAttack: { id: 'waterAttack', kind: 'attack', name: 'Water splash', element: 'water', amount: 0.5 },

  // Morvath, the Shadow Warden (boss)
  shadowStrike: { id: 'shadowStrike', kind: 'attack', name: 'Shadow strike', element: 'shadow', amount: 0.5 },
  shadowCrush: { id: 'shadowCrush', kind: 'attack', name: 'Shadow crush', element: 'shadow', amount: 2, maxUses: 3 },
  darkMend: { id: 'darkMend', kind: 'heal', name: 'Dark mend', amount: 1, maxUses: 3 },
  wardenFocus: { id: 'wardenFocus', kind: 'boost', name: 'Warden’s focus', amount: 0.5 },
};

// How each enemy picks its next action.
export const SCRIPTS = {
  // The slime repeats: boost, boosted water attack, normal water attack.
  //   round 1  Bubble up: its next attack deals +½ heart
  //   round 2  Water splash: ½ + ½ boost = 1 heart
  //   round 3  Water splash: ½ heart
  //   round 4  starts again
  slime: (state) => {
    const pattern = ['slimeBoost', 'waterAttack', 'waterAttack'];
    return pattern[state.turn % pattern.length];
  },

  // Morvath:
  //   - Heals 1 heart when down to half health or less (3 times per fight,
  //     never two turns in a row).
  //   - Otherwise repeats: Shadow strike, Warden's focus (boost),
  //     Shadow crush (the big hit, 3 times per fight; after that it uses
  //     Shadow strike instead).
  morvath: (state) => {
    if (state.hearts <= state.max / 2 && state.hearts < state.max && canUse(state, 'darkMend') && state.last !== 'darkMend') {
      return 'darkMend';
    }
    const pattern = ['shadowStrike', 'wardenFocus', 'shadowCrush'];
    const id = pattern[state.cycle % pattern.length];
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
    boost: 0,   // extra damage added to its next attack
    turn: 0,    // how many turns it has taken
    cycle: 0,   // position in its pattern (heals don't move it on)
    uses: {},   // times each limited action was used
    last: null, // its last action
  };
}

// What the enemy will do on its next turn (shown above its head).
export function getIntent(state) {
  const action = ACTIONS[SCRIPTS[state.id](state)];
  const total = action.kind === 'attack' ? action.amount + state.boost : action.amount;
  return { ...action, total, boosted: action.kind === 'attack' && state.boost > 0 };
}

// Do the enemy's turn. Returns its new state, the damage dealt to the
// player and a line of text describing what happened.
export function takeTurn(state, enemyName) {
  const intent = getIntent(state);
  const next = {
    ...state,
    turn: state.turn + 1,
    cycle: intent.kind === 'heal' ? state.cycle : state.cycle + 1,
    uses: { ...state.uses, [intent.id]: (state.uses[intent.id] ?? 0) + 1 },
    last: intent.id,
  };
  let damage = 0;
  let message;

  if (intent.kind === 'boost') {
    next.boost = state.boost + intent.amount;
    message = `${enemyName} uses ${intent.name}! Its next attack deals +${hearts(intent.amount)}.`;
  } else if (intent.kind === 'heal') {
    next.hearts = Math.min(state.max, state.hearts + intent.amount);
    message = `${enemyName} uses ${intent.name} and heals ${hearts(next.hearts - state.hearts)}.`;
  } else {
    damage = intent.total;
    next.boost = 0;
    message = `${enemyName} uses ${intent.name}! You lose ${hearts(damage)}.`;
  }
  return { state: next, damage, message, action: intent };
}

// The enemy is hit by a spell.
export function hitEnemy(state, amount) {
  return { ...state, hearts: Math.max(0, state.hearts - amount) };
}

// 0.5 -> "½ heart", 1 -> "1 heart", 1.5 -> "1½ hearts"
export function hearts(value) {
  const whole = Math.floor(value);
  const half = value - whole >= 0.5 ? '½' : '';
  const text = whole === 0 ? half : `${whole}${half}`;
  return `${text} ${value > 1 ? 'hearts' : 'heart'}`;
}

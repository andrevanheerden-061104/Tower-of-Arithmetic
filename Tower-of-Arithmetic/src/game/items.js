import { ITEMS } from './encounters';

// ---------------------------------------------------------------------------
// What the player's items do. Items stay for the whole run and work on
// their own (no tapping):
//   Heartstone Amulet          +1 heart (added when the item is picked up,
//                              see addItem in run.js)
//   Hourglass of First Light   the player always moves first in a fight
//   Frostward Ring             ice and water attacks hurt ½ heart less
//   Emberguard Ring            fire attacks hurt ½ heart less
//   Veil of Dusk               shadow attacks hurt ½ heart less
//   Scroll of Sharpened Spells attack spells deal +½ heart
//   Phoenix Feather Charm      once per run, back up with 1 heart instead
//                              of falling
//   Cursed Scroll              attack spells deal +1 heart, but ½ heart is
//                              lost at the start of every floor (the curse)
// The numbers live with each item in ITEMS (src/game/encounters.js).
// ---------------------------------------------------------------------------

export const hasItem = (run, itemId) => run.items.includes(itemId);

// Extra damage added to every attack spell.
export function attackBonus(run) {
  return run.items.reduce((total, id) => total + (ITEMS[id]?.attackBonus ?? 0), 0);
}

// The item that guards against an attack of this element ('fire', 'ice',
// 'shadow'), or null.
export function guardFor(run, element) {
  if (!element) return null;
  return run.items.find((id) => ITEMS[id]?.guards === element) ?? null;
}

// How much damage an enemy attack does once the player's items have
// blocked their part. Returns { amount, guard } (guard = the item that
// helped, or null).
export function blockAttack(run, action, amount) {
  const guard = amount > 0 ? guardFor(run, action?.element) : null;
  if (!guard) return { amount, guard: null };
  return { amount: Math.max(0, amount - ITEMS[guard].block), guard };
}

// The Hourglass of First Light: no die roll, the player goes first.
export const movesFirst = (run) => hasItem(run, 'hourglass');

// The Phoenix Feather Charm can still save the player this run.
export const canRevive = (run) => hasItem(run, 'phoenixCharm') && !run.phoenixUsed;

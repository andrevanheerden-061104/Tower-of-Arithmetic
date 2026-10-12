import { createRandom, shuffle } from './random';

// Content for the rooms: enemies, items, potions, the trader's wares and the
// ghost's gifts. Numbers are not balanced yet.

export const ENEMIES = {
  // Level 1: lower floors, fixed attack patterns (see src/game/enemyAI.js)
  slime: {
    id: 'slime',
    name: 'Slime',
    level: 1,
    hearts: 2,
    image: require('../assets/enemys/slime.png'),
  },
  pumpkin: {
    id: 'pumpkin',
    name: 'Pumpkin',
    level: 1,
    hearts: 2,
    image: require('../assets/enemys/pumken.png'),
  },
  // Level 2: higher floors, random attacks, heal once per fight
  darkOwl: {
    id: 'darkOwl',
    name: 'Dark Owl',
    level: 2,
    // Same hearts as level 1, but they hit harder. With 2.5 hearts a
    // player still using ½-heart spells almost never won (balance test).
    hearts: 2,
    image: require('../assets/enemys/darkowl.png'),
  },
  fireLizard: {
    id: 'fireLizard',
    name: 'Fire Lizard',
    level: 2,
    hearts: 2,
    image: require('../assets/enemys/fireLizard.png'),
  },
  // Boss: top floor
  morvath: {
    id: 'morvath',
    name: 'Morvath',
    title: 'the Shadow Warden',
    hearts: 5,
    image: require('../assets/boss/boss1.png'),
  },
};

// Items stay with the player for the whole run and work on their own (what
// each one does is in src/game/items.js). A cursed item is stronger but
// carries a drawback until a campfire burns the curse away (not in junior
// mode). `price` is what the trader asks.
export const ITEMS = {
  heartstoneAmulet: {
    id: 'heartstoneAmulet',
    name: 'Heartstone Amulet',
    image: require('../assets/items/heartstone-amulet-icon.png'),
    effect: '+1 heart for the rest of the run',
    extraHearts: 1,
    price: 70,
  },
  hourglass: {
    id: 'hourglass',
    name: 'Hourglass of First Light',
    image: require('../assets/items/hourglass-icon.png'),
    effect: 'You always move first in a fight',
    price: 60,
  },
  frostwardRing: {
    id: 'frostwardRing',
    name: 'Frostward Ring',
    image: require('../assets/items/frostward-ring-icon.png'),
    effect: 'Ice and water attacks hurt you ½ heart less',
    guards: 'ice',
    block: 0.5,
    price: 45,
  },
  emberguardRing: {
    id: 'emberguardRing',
    name: 'Emberguard Ring',
    image: require('../assets/items/emberguard-ring-icon.png'),
    effect: 'Fire attacks hurt you ½ heart less',
    guards: 'fire',
    block: 0.5,
    price: 45,
  },
  veilOfDusk: {
    id: 'veilOfDusk',
    name: 'Veil of Dusk',
    image: require('../assets/items/veil-of-dusk-icon.png'),
    effect: 'Shadow attacks hurt you ½ heart less',
    guards: 'shadow',
    block: 0.5,
    price: 45,
  },
  sharpenedScroll: {
    id: 'sharpenedScroll',
    name: 'Scroll of Sharpened Spells',
    image: require('../assets/items/scroll-icon.png'),
    effect: 'Attack spells deal +½ heart',
    attackBonus: 0.5,
    price: 65,
  },
  phoenixCharm: {
    id: 'phoenixCharm',
    name: 'Phoenix Feather Charm',
    image: require('../assets/items/phoenix-feather-icon.png'),
    effect: 'Once per run, rise again with 1 heart instead of falling',
    price: 80,
  },
  // The ghost's stronger, cursed gift
  cursedScroll: {
    id: 'cursedScroll',
    name: 'Cursed Scroll',
    image: require('../assets/items/scroll-icon.png'),
    effect: 'Attack spells deal +1 heart',
    attackBonus: 1,
    cursed: true,
    curse: '½ heart less at the start of every floor',
  },
};

// The items the trader can sell (the cursed scroll only comes from the ghost).
const SHOP_ITEMS = Object.keys(ITEMS).filter((id) => !ITEMS[id].cursed);

// Healing potions: drunk in a fight by tapping them (up to 4 carried).
export const POTIONS = {
  minor: {
    id: 'minor',
    name: 'Minor Healing Potion',
    image: require('../assets/potions/minor-healing-icon.png'),
    effect: 'Heal ½ heart',
    heal: 0.5,
    price: 15,
  },
  heal: {
    id: 'heal',
    name: 'Healing Potion',
    image: require('../assets/potions/healing-icon.png'),
    effect: 'Heal 1 heart',
    heal: 1,
    price: 30,
  },
  greater: {
    id: 'greater',
    name: 'Greater Healing Potion',
    image: require('../assets/potions/greater-healing-icon.png'),
    effect: 'Heal 2 hearts',
    heal: 2,
    price: 60,
  },
};

// What the wandering trader sells in this room (intermediate and senior):
// 2 spell cards, 2 potions and 2 items the player doesn't have yet. The
// pick comes from the run's seed and the room, so it stays the same if the
// player leaves to the menu and comes back.
export function shopWares(run) {
  const random = createRandom((run.seed ^ hash(run.currentId)) >>> 0);
  const pickFrom = (list, count) => shuffle(random, list).slice(0, count);
  const spells = [
    { id: 'card-flashflame', kind: 'spell', spellId: 'flashflame', name: 'Flashflame', price: 30 },
    { id: 'card-freeze', kind: 'spell', spellId: 'flashFreeze', name: 'Flash Freeze', price: 30 },
    { id: 'card-shard', kind: 'spell', spellId: 'shadowShard', name: 'Shadow Shard', price: 30 },
    { id: 'card-flash', kind: 'spell', spellId: 'flash', name: 'Flash', price: 35 },
  ];
  const potions = Object.values(POTIONS).map((p) => ({ id: `potion-${p.id}`, kind: 'potion', potionId: p.id, name: p.name, price: p.price }));
  const items = SHOP_ITEMS.filter((id) => !run.items.includes(id)).map((id) => ({ id: `item-${id}`, kind: 'item', itemId: id, name: ITEMS[id].name, price: ITEMS[id].price }));
  return [...pickFrom(spells, 2), ...pickFrom(potions, 2), ...pickFrom(items, 2)];
}

function hash(text) {
  let h = 2166136261;
  for (let i = 0; i < text.length; i++) h = Math.imul(h ^ text.charCodeAt(i), 16777619);
  return h >>> 0;
}

// The ghost's three gifts. The third gift depends on the version:
// junior mode has no curses, so the youngest players get a gentle heal instead.
export function ghostGifts(version) {
  const first = version.usesCoins
    ? { id: 'coins', title: 'Ghostly coins', detail: 'Gain 30 coins.', drawback: null, icon: 'coin' }
    : { id: 'xp', title: 'Glowing star', detail: 'Gain 30 XP.', drawback: null, icon: 'star' };
  const third = version.usesCurses
    ? {
        id: 'cursedScroll',
        title: 'Cursed Scroll',
        detail: 'A stronger item: every attack spell deals +1 heart.',
        drawback: 'Drawback: it carries a curse. Lose ½ heart at the start of every floor.',
        icon: 'cursedScroll',
        cursed: true,
      }
    : { id: 'heal', title: 'Warm glow', detail: 'Heal ½ heart.', drawback: null, icon: 'heart' };
  return [
    first,
    { id: 'spell', title: 'Spell choice', detail: 'Choose 1 of 3 spell cards for your deck.', drawback: null, icon: 'card' },
    third,
  ];
}

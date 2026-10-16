import { createRandom, shuffle } from './random';

// Content for the rooms: enemies, bosses, items, potions, the trader's
// wares and the gifts in mystery rooms (the ghost and the librarian).
// Numbers are not balanced yet.
//
// Enemies come in two levels (tiers):
//   level 1   2 hearts, a fixed pattern of moves (like the Slime)
//   level 2   3 hearts for the newer ones (the Dark Owl and Fire Lizard
//             hit harder, so they keep 2), random moves and one heal
// How they act is in src/game/enemyAI.js. Higher climbs of the tower add
// hearts and power to every enemy (src/game/tower.js).
//
// Where each picture stands (src/screens/TowerFloors/combat/components/BattleStage.js):
//   ground  the empty space under the feet in the picture, as a part of
//           its height (measured from each PNG), so the feet touch the floor
//   flying  hovers above its shadow and bobs up and down

export const ENEMIES = {
  // Level 1: lower floors, fixed attack patterns (see src/game/enemyAI.js)
  slime: {
    id: 'slime',
    name: 'Slime',
    level: 1,
    hearts: 2,
    ground: 0.033,
    image: require('../assets/enemys/slime.png'),
  },
  pumpkin: {
    id: 'pumpkin',
    name: 'Pumpkin',
    level: 1,
    hearts: 2,
    ground: 0.049,
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
    ground: 0.076,
    flying: true, // flaps above the floor
    image: require('../assets/enemys/darkowl.png'),
  },
  fireLizard: {
    id: 'fireLizard',
    name: 'Fire Lizard',
    level: 2,
    hearts: 2,
    ground: 0.037,
    image: require('../assets/enemys/fireLizard.png'),
  },
  bookMimic: {
    id: 'bookMimic',
    name: 'Book Mimic',
    level: 1,
    hearts: 2,
    ground: 0.127,
    image: require('../assets/enemys/book_mimic.png'),
  },
  crystalCrawler: {
    id: 'crystalCrawler',
    name: 'Crystal Crawler',
    level: 1,
    hearts: 2,
    ground: 0.13,
    image: require('../assets/enemys/crad.png'),
  },
  frostWyvern: {
    id: 'frostWyvern',
    name: 'Frost Wyvern',
    level: 2,
    hearts: 3,
    scale: 1.25,
    ground: 0.034,
    flying: true, // wings up, legs hanging
    image: require('../assets/enemys/wyvern.png'),
  },
  glassKnight: {
    id: 'glassKnight',
    name: 'Glass Knight',
    level: 2,
    hearts: 3,
    scale: 1.3,
    ground: 0.003,
    image: require('../assets/enemys/glass.png'),
  },
  // Bosses: the top floor of each climb (picked at random, see BOSS_IDS in
  // src/game/enemyAI.js)
  morvath: {
    id: 'morvath',
    name: 'Morvath',
    title: 'the Shadow Warden',
    boss: true,
    hearts: 5,
    ground: 0.008,
    image: require('../assets/boss/boss1.png'),
  },
  marionetta: {
    id: 'marionetta',
    name: 'Marionetta',
    title: 'the Puppet Queen',
    boss: true,
    hearts: 5,
    ground: 0.029,
    flying: true, // hangs from her strings
    image: require('../assets/boss/puppet.png'),
  },
  merlinShadow: {
    id: 'merlinShadow',
    name: 'Shadow of Merlin',
    title: 'the Starless Sage',
    boss: true,
    hearts: 5,
    ground: 0.019,
    image: require('../assets/boss/shadow-of-merlin.png'),
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
    about: 'A warm red stone that beats like a second heart. It gives you 1 extra heart for the whole run.',
    when: 'All run long',
    extraHearts: 1,
    price: 70,
  },
  hourglass: {
    id: 'hourglass',
    name: 'Hourglass of First Light',
    image: require('../assets/items/hourglass-icon.png'),
    effect: 'You always move first in a fight',
    about: 'Its sand glows with the first light of morning. In every fight you take the first turn, with no dice roll.',
    when: 'At the start of every fight',
    price: 60,
  },
  frostwardRing: {
    id: 'frostwardRing',
    name: 'Frostward Ring',
    image: require('../assets/items/frostward-ring-icon.png'),
    effect: 'Ice and water attacks hurt you ½ heart less',
    about: 'A ring of ice that never melts. When an ice or water enemy hits you, you lose ½ heart less.',
    when: 'Every ice or water attack',
    guards: 'ice',
    block: 0.5,
    price: 45,
  },
  emberguardRing: {
    id: 'emberguardRing',
    name: 'Emberguard Ring',
    image: require('../assets/items/emberguard-ring-icon.png'),
    effect: 'Fire attacks hurt you ½ heart less',
    about: 'A ring that stays warm even in the dark. When a fire enemy hits you, you lose ½ heart less.',
    when: 'Every fire attack',
    guards: 'fire',
    block: 0.5,
    price: 45,
  },
  veilOfDusk: {
    id: 'veilOfDusk',
    name: 'Veil of Dusk',
    image: require('../assets/items/veil-of-dusk-icon.png'),
    effect: 'Shadow attacks hurt you ½ heart less',
    about: 'A thin cloth woven from twilight. When a shadow enemy hits you, you lose ½ heart less.',
    when: 'Every shadow attack',
    guards: 'shadow',
    block: 0.5,
    price: 45,
  },
  sharpenedScroll: {
    id: 'sharpenedScroll',
    name: 'Scroll of Sharpened Spells',
    image: require('../assets/items/scroll-icon.png'),
    effect: 'Attack spells deal +½ heart',
    about: 'Battle spells honed to a fine edge. Every attack spell you cast hits ½ heart harder.',
    when: 'Every attack spell you cast',
    attackBonus: 0.5,
    price: 65,
  },
  phoenixCharm: {
    id: 'phoenixCharm',
    name: 'Phoenix Feather Charm',
    image: require('../assets/items/phoenix-feather-icon.png'),
    effect: 'Once per run, rise again with 1 heart instead of falling',
    about: 'A feather that still burns. The first time you would fall this run, you rise again with 1 heart.',
    when: 'Once, when you would fall',
    price: 80,
  },
  // The ghost's stronger, cursed gift
  cursedScroll: {
    id: 'cursedScroll',
    name: 'Cursed Scroll',
    image: require('../assets/items/scroll-icon.png'),
    effect: 'Attack spells deal +1 heart',
    about: 'Dark words that make your spells fierce. Every attack spell you cast hits 1 heart harder.',
    when: 'Every attack spell you cast',
    attackBonus: 1,
    cursed: true,
    curse: '½ heart less at the start of every floor',
  },
};

// The items the trader can sell (the cursed scroll only comes from the ghost).
const SHOP_ITEMS = Object.keys(ITEMS).filter((id) => !ITEMS[id].cursed);

// Healing potions: tap one in a fight to see it, then drink it (up to 4
// carried). Drinking doesn't use up the player's turn.
export const POTIONS = {
  minor: {
    id: 'minor',
    name: 'Minor Healing Potion',
    image: require('../assets/potions/minor-healing-icon.png'),
    effect: 'Heal ½ heart',
    about: 'A small sip of red brew. Drink it to win back ½ heart.',
    heal: 0.5,
    price: 15,
  },
  heal: {
    id: 'heal',
    name: 'Healing Potion',
    image: require('../assets/potions/healing-icon.png'),
    effect: 'Heal 1 heart',
    about: 'A warm, glowing brew from the tower’s healers. Drink it to win back 1 heart.',
    heal: 1,
    price: 30,
  },
  greater: {
    id: 'greater',
    name: 'Greater Healing Potion',
    image: require('../assets/potions/greater-healing-icon.png'),
    effect: 'Heal 2 hearts',
    about: 'The strongest brew in the tower. Drink it to win back 2 hearts.',
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

// Gifts in mystery rooms. Each gift says what it gives:
//   coins, xp, heal (hearts), potion (a potion id), item (an item id),
//   cost (hearts lost for taking it); id 'spell' opens the spell picker.

// The ghost's three gifts. The third gift depends on the version:
// junior mode has no curses, so the youngest players get a gentle heal instead.
export function ghostGifts(version) {
  const first = version.usesCoins
    ? { id: 'coins', title: 'Ghostly coins', detail: 'Gain 30 coins.', drawback: null, icon: 'coin', coins: 30 }
    : { id: 'xp', title: 'Glowing star', detail: 'Gain 30 XP.', drawback: null, icon: 'star', xp: 30 };
  const third = version.usesCurses
    ? {
        id: 'cursedScroll',
        item: 'cursedScroll',
        title: 'Cursed Scroll',
        detail: 'A stronger item: every attack spell deals +1 heart.',
        drawback: 'Drawback: it carries a curse. Lose ½ heart at the start of every floor.',
        icon: 'cursedScroll',
        cursed: true,
      }
    : { id: 'heal', title: 'Warm glow', detail: 'Heal ½ heart.', drawback: null, icon: 'heart', heal: 0.5 };
  return [
    first,
    { id: 'spell', title: 'Spell choice', detail: 'Choose 1 of 3 spell cards for your deck.', drawback: null, icon: 'card' },
    third,
  ];
}

// The librarian's three gifts. `random` is the room's own random numbers,
// so the forbidden book is the same if the player looks away and back.
//   1. study: XP
//   2. a Healing Potion (junior: heal 1 heart, as there are no potions)
//   3. a random item the player doesn't have, but a book bites (lose ½
//      heart). Junior: a picture book of spells (choose 1 of 3 cards).
export function librarianGifts(run, version, random = Math.random) {
  const study = { id: 'study', title: 'Study session', detail: 'Read with the librarian. Gain 40 XP.', drawback: null, icon: 'star', xp: 40 };
  const second = version.usesPotions
    ? { id: 'potion', title: 'A potion from the shelf', detail: 'Take a Healing Potion (heals 1 heart).', drawback: null, icon: 'heal', potion: 'heal' }
    : { id: 'readHeal', title: 'Cosy reading nook', detail: 'Rest with a good book. Heal 1 heart.', drawback: null, icon: 'heart', heal: 1 };
  if (!version.usesCurses) {
    return [study, second, { id: 'spell', title: 'Picture book of spells', detail: 'Choose 1 of 3 spell cards for your deck.', drawback: null, icon: 'card' }];
  }
  const choices = SHOP_ITEMS.filter((id) => !run.items.includes(id));
  if (!choices.length) {
    return [study, second, { id: 'goldLeaf', title: 'Gold-leaf pages', detail: 'Gain 40 coins.', drawback: null, icon: 'coin', coins: 40 }];
  }
  const item = ITEMS[choices[Math.floor(random() * choices.length)]];
  return [
    study,
    second,
    {
      id: 'relic',
      title: `Forbidden shelf: ${item.name}`,
      detail: `${item.effect}.`,
      drawback: 'Drawback: a book bites as you take it. Lose ½ heart.',
      icon: item.id,
      item: item.id,
      cost: 0.5,
    },
  ];
}

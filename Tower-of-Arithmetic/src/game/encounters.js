// Placeholder content for the rooms: enemies, items, potions, the trader's
// wares and the ghost's gifts. Numbers are not balanced yet.

export const ENEMIES = {
  slime: {
    id: 'slime',
    name: 'Slime',
    hearts: 3,
    image: require('../assets/enemys/slime.png'),
  },
  morvath: {
    id: 'morvath',
    name: 'Morvath',
    title: 'the Shadow Warden',
    hearts: 5,
    image: require('../assets/enemys/boss1.png'),
  },
};

// Items stay with the player for the whole run. Cursed items are stronger
// but carry a drawback (senior mode only).
export const ITEMS = {
  luckyGem: { id: 'luckyGem', name: 'Lucky gem', icon: 'gem', effect: '+5 coins after every fight', cursed: false },
  goldRing: { id: 'goldRing', name: 'Gold ring', icon: 'ring', effect: 'Start each fight with a free hint', cursed: false },
  hauntedRing: {
    id: 'hauntedRing',
    name: 'Haunted ring',
    icon: 'ring',
    effect: 'Attack spells deal +½ heart',
    cursed: true,
    curse: '½ heart less each floor',
  },
  rustyLantern: {
    id: 'rustyLantern',
    name: 'Rusty lantern',
    icon: 'lantern',
    effect: '1 free hint every floor',
    cursed: true,
    curse: 'Shop prices +10 coins',
  },
};

// Potions are used up when tapped in a fight.
export const POTIONS = {
  heal: { id: 'heal', name: 'Heal potion', effect: 'Heal ½ heart', color: '#F2D3D0' },
  power: { id: 'power', name: 'Power potion', effect: 'Your next spell can’t miss', color: '#A77BFF' },
};

// What the wandering trader sells (intermediate and senior).
export const SHOP_WARES = [
  { id: 'card-flashflame', kind: 'spell', spellId: 'flashflame', name: 'Flashflame', price: 30 },
  { id: 'card-random', kind: 'spell', spellId: 'flashFreeze', name: 'Spell card', price: 40 },
  { id: 'item-gem', kind: 'item', itemId: 'luckyGem', name: 'Lucky gem', price: 25 },
  { id: 'potion-heal', kind: 'potion', potionId: 'heal', name: 'Heal potion', price: 15 },
  { id: 'potion-power', kind: 'potion', potionId: 'power', name: 'Power potion', price: 20 },
  { id: 'item-ring', kind: 'item', itemId: 'goldRing', name: 'Gold ring', price: 60 },
];

// The ghost's three gifts. The third gift depends on the version: only
// senior mode has curses, so younger players get a gentle heal instead.
export function ghostGifts(version) {
  const first = version.usesCoins
    ? { id: 'coins', title: 'Ghostly coins', detail: 'Gain 30 coins.', drawback: null, icon: 'coin' }
    : { id: 'xp', title: 'Glowing star', detail: 'Gain 30 XP.', drawback: null, icon: 'star' };
  const third = version.usesCurses
    ? {
        id: 'hauntedRing',
        title: 'Haunted ring',
        detail: 'A stronger item: every attack spell deals +½ heart.',
        drawback: 'Drawback: it carries a curse. Start each floor with ½ heart less.',
        icon: 'ring',
        cursed: true,
      }
    : { id: 'heal', title: 'Warm glow', detail: 'Heal ½ heart.', drawback: null, icon: 'heart' };
  return [
    first,
    { id: 'spell', title: 'Spell choice', detail: 'Choose 1 of 3 spell cards for your deck.', drawback: null, icon: 'card' },
    third,
  ];
}

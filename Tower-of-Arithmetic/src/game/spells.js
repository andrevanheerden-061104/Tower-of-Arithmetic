// The spell cards. Each spell has a standard card (Grades 4-11) and a
// simpler junior card (Grades 1-3). Placeholder numbers until the game
// design is final.
//
//   kind     'attack' hurts the enemy, 'heal' heals the player
//   level    1, 2 or 3 (every level 3 spell is legendary)
//   hits     what an attack does: one or more { element, amount } parts,
//            so a legendary can mix two elements (amount is in hearts)
//   heal     hearts healed (heal spells)
//   juniorOp the kind of sum the spell casts in a junior "mixed" dungeon

export const SPELLS = {
  // --- Level 1 ---------------------------------------------------------
  flashflame: {
    id: 'flashflame',
    name: 'Flashflame',
    kind: 'attack',
    level: 1,
    element: 'Fire',
    hits: [{ element: 'fire', amount: 0.5 }],
    juniorOp: 'adding',
    cards: {
      standard: require('../assets/cards/Cards-S/flame/flashflame-front.png'),
      junior: require('../assets/cards/Crads-J/flame/flashflame-junior_1.png'),
      back: require('../assets/cards/Cards-S/flame/flame-back.png'),
    },
  },
  flashFreeze: {
    id: 'flashFreeze',
    name: 'Flash Freeze',
    kind: 'attack',
    level: 1,
    element: 'Ice',
    hits: [{ element: 'ice', amount: 0.5 }],
    juniorOp: 'takingAway',
    cards: {
      standard: require('../assets/cards/Cards-S/ice/ice-front.png'),
      junior: require('../assets/cards/Crads-J/ice/flash-freeze-junior_1.png'),
      back: require('../assets/cards/Cards-S/ice/flash-freeze-back.png'),
    },
  },
  shadowShard: {
    id: 'shadowShard',
    name: 'Shadow Shard',
    kind: 'attack',
    level: 1,
    element: 'Shadow',
    hits: [{ element: 'shadow', amount: 0.5 }],
    juniorOp: 'times',
    cards: {
      standard: require('../assets/cards/Cards-S/shadow/shadow-shard-front.png'),
      junior: require('../assets/cards/Crads-J/shadow/shadow-shard-junior_1.png'),
      back: require('../assets/cards/Cards-S/shadow/shadow-back.png'),
    },
  },
  flash: {
    id: 'flash',
    name: 'Flash',
    kind: 'attack',
    level: 1,
    element: 'Light',
    hits: [{ element: 'light', amount: 0.5 }],
    juniorOp: 'patterns',
    cards: {
      standard: require('../assets/cards/Cards-S/light/flash-front.png'),
      junior: require('../assets/cards/Crads-J/light/flash-junior.png'),
      back: require('../assets/cards/Cards-S/light/flash-back.png'),
    },
  },
  soothingGlow: {
    id: 'soothingGlow',
    name: 'Soothing Glow',
    kind: 'heal',
    level: 1,
    element: 'Support',
    heal: 0.5,
    juniorOp: 'adding',
    cards: {
      standard: require('../assets/cards/Cards-S/support/soothing-glow-front.png'),
      junior: require('../assets/cards/Crads-J/support/soothing-glow-junior.png'),
      back: require('../assets/cards/Cards-S/support/support-back.png'),
    },
  },

  // --- Level 2 ---------------------------------------------------------
  azureBlaze: {
    id: 'azureBlaze',
    name: 'Azure Blaze',
    kind: 'attack',
    level: 2,
    element: 'Fire',
    hits: [{ element: 'fire', amount: 1 }],
    juniorOp: 'adding',
    cards: {
      standard: require('../assets/cards/Cards-S/flame/azure-blaze-front.png'),
      junior: require('../assets/cards/Crads-J/flame/azure-blaze-junior.png'),
      back: require('../assets/cards/Cards-S/flame/flame-back.png'),
    },
  },
  butterflyIllusion: {
    id: 'butterflyIllusion',
    name: 'Butterfly Illusion',
    kind: 'attack',
    level: 2,
    element: 'Shadow',
    hits: [{ element: 'shadow', amount: 1 }],
    juniorOp: 'times',
    cards: {
      standard: require('../assets/cards/Cards-S/shadow/butterfly-illusion-front.png'),
      junior: require('../assets/cards/Crads-J/shadow/butterfly-illusion-junior.png'),
      back: require('../assets/cards/Cards-S/shadow/shadow-back.png'),
    },
  },
  verdantMend: {
    id: 'verdantMend',
    name: 'Verdant Mend',
    kind: 'heal',
    level: 2,
    element: 'Support',
    heal: 1.5,
    juniorOp: 'adding',
    cards: {
      standard: require('../assets/cards/Cards-S/support/verdant-mend-front.png'),
      junior: require('../assets/cards/Crads-J/support/verdant-mend-junior.png'),
      back: require('../assets/cards/Cards-S/support/support-back.png'),
    },
  },

  // --- Level 3 (legendary) --------------------------------------------
  emberwing: {
    id: 'emberwing',
    name: 'Emberwing',
    kind: 'attack',
    level: 3,
    legendary: true,
    element: 'Shadow + Fire',
    hits: [
      { element: 'shadow', amount: 1 },
      { element: 'fire', amount: 2 },
    ],
    juniorOp: 'times',
    cards: {
      standard: require('../assets/cards/Cards-S/legendary/shadowflame/emberwing-front.png'),
      junior: require('../assets/cards/Crads-J/legendary/shadowflame/emberwing-junior.png'),
      back: require('../assets/cards/Cards-S/legendary/shadowflame/shadowflame-back.png'),
    },
  },
};

export const SPELL_IDS = Object.keys(SPELLS);
export const MAX_DECK = 5;

export function getSpell(id) {
  return SPELLS[id] ?? SPELLS.flashflame;
}

// The card picture for the player's version of the game.
export function cardImage(spellId, cardSet = 'standard') {
  const spell = getSpell(spellId);
  return spell.cards[cardSet] ?? spell.cards.standard;
}

// Total damage of an attack spell before weaknesses.
export function baseDamage(spell) {
  return (spell.hits ?? []).reduce((sum, h) => sum + h.amount, 0);
}

// Three spells offered after a fight. Spells already in the deck are left
// out. Higher floors offer stronger spells: level 2 from 30% of the way up,
// and a small chance of a legendary in the top half of the tower.
export function spellOffers(deck, progress, count = 3) {
  const pool = SPELL_IDS.filter((id) => !deck.includes(id)).filter((id) => {
    const level = SPELLS[id].level;
    if (level === 1) return true;
    if (level === 2) return progress >= 0.3;
    return progress >= 0.5;
  });
  const weight = (id) => {
    const level = SPELLS[id].level;
    if (level === 3) return 0.25;
    if (level === 2) return 1 + progress;
    return 1.5 - progress;
  };
  const offers = [];
  const left = [...pool];
  while (offers.length < count && left.length) {
    const total = left.reduce((s, id) => s + weight(id), 0);
    let roll = Math.random() * total;
    const i = left.findIndex((id) => (roll -= weight(id)) < 0);
    offers.push(left.splice(i < 0 ? 0 : i, 1)[0]);
  }
  return offers;
}

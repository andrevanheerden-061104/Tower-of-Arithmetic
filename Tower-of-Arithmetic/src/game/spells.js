// The spell cards. Each spell has a standard card (Grades 4-11) and a
// simpler junior card (Grades 1-3). Placeholder numbers until the game
// design is final.

export const SPELLS = {
  flashflame: {
    id: 'flashflame',
    name: 'Flashflame',
    element: 'Fire',
    damage: 0.5, // hearts
    color: '#FF9A3D',
    // In junior mode each spell casts its own kind of sum
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
    element: 'Ice',
    damage: 0.5,
    color: '#8FDCFF',
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
    element: 'Shadow',
    damage: 0.5,
    color: '#B48CFF',
    juniorOp: 'times',
    cards: {
      standard: require('../assets/cards/Cards-S/shadow/shadow-shard-front.png'),
      junior: require('../assets/cards/Crads-J/shadow/shadow-shard-junior_1.png'),
      back: require('../assets/cards/Cards-S/shadow/shadow-back.png'),
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

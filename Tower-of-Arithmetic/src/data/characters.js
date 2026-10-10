// Every playable character. Placeholder data until the backend exists.
//
// image   the front-facing sprite
// aspect  sprite width / height, so it can be sized without loading it first
// face    where the face is in the sprite (0-1 across, 0-1 down), used to
//         crop small portraits
// locked  locked characters are shown as a black silhouette
// backImage  the sprite seen from behind, used in fights
// spell   the attack spell the character starts every run with

export const CHARACTERS = [
  {
    id: 'shadow',
    name: 'Shadow',
    title: 'shadow apprentice',
    hearts: 3,
    image: require('../assets/charaters/sorceress1-F-front.png'),
    backImage: require('../assets/charaters/sorceress1-F-back.png'),
    aspect: 1,
    face: { x: 0.5, y: 0.185 },
    locked: false,
    spell: {
      name: 'Shadow Shard',
      type: 'Attack spell',
      effect: 'Deals ½ heart of shadow damage',
      cardImage: require('../assets/cards/Cards-S/shadow/shadow-shard-front.png'),
    },
  },
  {
    id: 'ember',
    name: 'Ember', // placeholder name
    title: 'fire sorceress',
    hearts: 3,
    image: require('../assets/charaters/Fire sorceress2-F-front.png'),
    backImage: require('../assets/charaters/Fire sorceress2-F-back.png'),
    aspect: 1,
    face: { x: 0.52, y: 0.2 },
    locked: false,
    spell: {
      name: 'Flashflame',
      type: 'Attack spell',
      effect: 'Deals ½ heart of fire damage',
      cardImage: require('../assets/cards/Cards-S/flame/flashflame-front.png'),
    },
  },
  {
    id: 'white',
    name: '???',
    title: 'locked',
    hearts: 3,
    image: require('../assets/charaters/WhiteSorceress3-F-front.png'),
    backImage: require('../assets/charaters/WhiteSorceress3-F-back.png'),
    aspect: 816 / 1285,
    face: { x: 0.54, y: 0.155 },
    locked: true,
    unlockHint: 'Keep climbing the tower to unlock this sorceress.',
    spell: null,
  },
];

export const DEFAULT_CHARACTER_ID = 'shadow';

export function getCharacter(id) {
  return CHARACTERS.find((c) => c.id === id) ?? CHARACTERS[0];
}

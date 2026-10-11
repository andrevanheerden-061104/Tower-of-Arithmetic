// Every playable character. Placeholder data until the backend exists.
//
// image      the front-facing sprite
// backImage  the sprite seen from behind, used in fights
// aspect     sprite width / height, so it can be sized without loading it first
// face       where the face is in the sprite (0-1 across, 0-1 down), used to
//            crop small portraits
// level      the character's own level, 1 to 20 (see characterLevels.js).
//            Every character is level 1 until the backend saves progress.
// xp         XP earned towards the next level
// locked     locked characters are shown as a black silhouette
// starter    the one spell card the character takes into the tower.
//            Every other card is collected on the way up.
// spell      how the starting spell is shown on the Characters screen

import { getSpell } from '../game/spells';

function starterInfo(spellId) {
  const spell = getSpell(spellId);
  return {
    name: spell.name,
    type: 'Attack spell',
    effect: `Deals ½ heart of ${spell.element.toLowerCase()} damage`,
    cardImage: spell.cards.standard,
  };
}

export const CHARACTERS = [
  {
    id: 'shadow',
    name: 'Nyxara',
    title: 'shadow sorceress',
    hearts: 3,
    image: require('../assets/charaters/nyxara-front.png'),
    backImage: require('../assets/charaters/nyxara-back.png'),
    aspect: 1,
    face: { x: 0.5, y: 0.185 },
    level: 1,
    xp: 0,
    locked: false,
    starter: 'shadowShard',
    spell: starterInfo('shadowShard'),
  },
  {
    id: 'ember',
    name: 'Ignara',
    title: 'fire sorceress',
    hearts: 3,
    image: require('../assets/charaters/ignara-front.png'),
    backImage: require('../assets/charaters/ignara-back.png'),
    aspect: 1,
    face: { x: 0.52, y: 0.2 },
    level: 1,
    xp: 0,
    locked: false,
    starter: 'flashflame',
    spell: starterInfo('flashflame'),
  },
  {
    id: 'white',
    name: 'Lumina',
    title: 'light sorceress',
    hearts: 3,
    image: require('../assets/charaters/lumina-front.png'),
    backImage: require('../assets/charaters/lumina-back.png'),
    aspect: 816 / 1285,
    face: { x: 0.54, y: 0.155 },
    level: 1,
    xp: 0,
    locked: true,
    unlockHint: 'Keep climbing the tower to unlock this sorceress.',
    starter: 'flash',
    spell: starterInfo('flash'),
  },
];

export const DEFAULT_CHARACTER_ID = 'shadow';

export function getCharacter(id) {
  return CHARACTERS.find((c) => c.id === id) ?? CHARACTERS[0];
}

// The character with the player's saved level and XP for it
// (`progress` is { shadow: { level, xp }, ... } from the database).
export function withProgress(character, progress) {
  const saved = progress?.[character.id];
  return saved ? { ...character, level: saved.level, xp: saved.xp } : character;
}

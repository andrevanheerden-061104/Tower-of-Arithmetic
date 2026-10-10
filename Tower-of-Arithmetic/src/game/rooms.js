// Every kind of room on the map: its name, its map icon and the screen
// that opens when the player enters it.

export const ROOMS = {
  start: { label: 'Tower gate', icon: 'flag', screen: null },
  combat: { label: 'Combat', icon: 'swords', screen: 'combat', description: 'A monster blocks the way. Solve a sum to cast your spell.' },
  puzzle: { label: 'Puzzle', icon: 'puzzle', screen: 'puzzle', description: 'A sealed door. Solve the puzzle to open it.' },
  mystery: { label: 'Mystery', icon: 'mystery', screen: 'mystery', description: 'Something strange is waiting. Who knows what you will find?' },
  shop: { label: 'Trader', icon: 'coins', screen: 'shop', description: 'A wandering trader sells spells and potions for gold.' },
  rest: { label: 'Rest', icon: 'campfire', screen: 'rest', description: 'A quiet campfire. Heal up before the climb.' },
  boss: { label: 'Boss', icon: 'crown', screen: 'boss', description: 'The guardian of the tower. Ready your best spells.' },
};

// Rooms that end with the reward screen (the others go straight back to the map).
export const REWARD_ROOMS = ['combat', 'puzzle', 'boss'];

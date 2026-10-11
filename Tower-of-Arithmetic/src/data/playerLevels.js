// The player's own level (separate from each character's level).
// Must match player_xp_to_next() in Backend/supabase/schema.sql.

// XP needed to go from `level` to the next one.
export function xpToNextLevel(level) {
  return 500 + (level - 1) * 250;
}

// Wizard ranks by player level, shown under the name.
const RANKS = [
  [1, 'Apprentice'],
  [5, 'Adept'],
  [10, 'Spellwright'],
  [15, 'Mage'],
  [20, 'Archmage'],
];

export function rankFor(level) {
  return RANKS.filter(([at]) => level >= at).pop()[1];
}

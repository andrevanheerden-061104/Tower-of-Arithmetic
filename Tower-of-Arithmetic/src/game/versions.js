// The three versions of the game. Which one a player gets depends on the
// grade they chose in onboarding (CAPS phases).
//
//   junior        Grades 1-3   tap the answer, pictures, read aloud, 5 floors
//   intermediate  Grades 4-6   type the final answer, no curses, 8 floors
//   senior        Grades 7-11  show each step, curses, 10 floors

export const VERSIONS = {
  junior: {
    id: 'junior',
    label: 'Junior',
    grades: 'Grades 1–3',
    floors: 5,            // the last floor is always the boss
    hearts: 3,
    startCoins: 0,
    usesCoins: false,     // no shop or coins: one less thing to keep track of
    usesCurses: false,
    usesPotions: false,
    answerMode: 'tap',    // tap one of three big answers
    cardSet: 'junior',    // the simpler junior spell cards
    // Room types that may appear on the map (boss is added on its own)
    rooms: ['combat', 'puzzle', 'mystery', 'rest'],
    dungeonTypes: [
      { id: 'adding', label: 'Adding', symbol: '+' },
      { id: 'takingAway', label: 'Take away', symbol: '−' },
      { id: 'times', label: 'Times', symbol: '×' },
      { id: 'patterns', label: 'Patterns', symbol: '#' },
    ],
  },
  intermediate: {
    id: 'intermediate',
    label: 'Intermediate',
    grades: 'Grades 4–6',
    floors: 8,
    hearts: 3,
    startCoins: 45,
    usesCoins: true,
    usesCurses: false,
    usesPotions: true,
    answerMode: 'type',   // work it out, type the final answer
    cardSet: 'standard',
    rooms: ['combat', 'puzzle', 'mystery', 'shop', 'rest'],
    dungeonTypes: [
      { id: 'multiplication', label: 'Multiplying', symbol: '×' },
      { id: 'division', label: 'Dividing', symbol: '÷' },
      { id: 'fractions', label: 'Fractions', symbol: '½' },
      { id: 'measurement', label: 'Measurement', symbol: 'm' },
      { id: 'patterns', label: 'Patterns', symbol: '#' },
      { id: 'data', label: 'Data', symbol: '%' },
    ],
  },
  senior: {
    id: 'senior',
    label: 'Senior',
    grades: 'Grades 7–11',
    floors: 10,
    hearts: 3,
    startCoins: 45,
    usesCoins: true,
    usesCurses: true,
    usesPotions: true,
    answerMode: 'steps',  // write each step of the working
    cardSet: 'standard',
    rooms: ['combat', 'puzzle', 'mystery', 'shop', 'rest'],
    dungeonTypes: [
      { id: 'algebra', label: 'Algebra', symbol: 'x' },
      { id: 'geometry', label: 'Geometry', symbol: '°' },
      { id: 'fractions', label: 'Fractions', symbol: '½' },
      { id: 'arithmetic', label: 'Arithmetic', symbol: '+' },
      { id: 'patterns', label: 'Patterns', symbol: '#' },
      { id: 'data', label: 'Data', symbol: '%' },
    ],
  },
};

export const MIXED = { id: 'mixed', label: 'Mixed dungeon', symbol: '+ x %' };

// Grade 1-3 -> junior, 4-6 -> intermediate, 7 and up -> senior.
// No grade yet (onboarding skipped) falls back to senior.
export function versionForGrade(grade) {
  if (grade == null) return VERSIONS.senior;
  if (grade <= 3) return VERSIONS.junior;
  if (grade <= 6) return VERSIONS.intermediate;
  return VERSIONS.senior;
}

// Look up a dungeon type (or "mixed") for a version.
export function getDungeonType(version, typeId) {
  if (typeId === MIXED.id) return MIXED;
  return version.dungeonTypes.find((t) => t.id === typeId) ?? MIXED;
}

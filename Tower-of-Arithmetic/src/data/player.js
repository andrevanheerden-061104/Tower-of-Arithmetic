// Placeholder player data until the backend exists.
// Home and Profile both read from here so they always agree.

export const PLAYER = {
  name: 'Nyxara',
  rank: 'Apprentice',
  level: 3,
  xp: 640,
  xpToNext: 1000,
  highestFloor: 7,
  runsCompleted: 12,
  accuracy: 78, // percent

  // How strong the player is in each dungeon (maths) type, 0-100.
  strengths: [
    { label: 'Algebra', value: 80 },
    { label: 'Geometry', value: 55 },
    { label: 'Fractions', value: 70 },
    { label: 'Arithmetic', value: 90 },
    { label: 'Patterns', value: 45 },
    { label: 'Data', value: 60 },
  ],

  badgesTotal: 12,
  badges: [
    { name: 'First Run', earned: true },
    { name: 'Floor 5', earned: true },
    { name: '10 Runs', earned: true },
    { name: 'Locked', earned: false },
  ],
};

export const SAVED_RUN = { floor: 4, totalFloors: 10, hearts: 2, maxHearts: 3 };

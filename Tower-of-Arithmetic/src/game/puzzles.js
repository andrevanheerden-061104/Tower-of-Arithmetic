import { pickPuzzleQuestion } from './questions';

// ---------------------------------------------------------------------------
// Puzzle rooms: a sealed door with a sum on it. The sum is always from the
// run's own maths topic (an algebra dungeon only has algebra doors) and
// gets harder higher up the tower:
//   floors 1-3  level 1      floors 4-6  level 2      floor 7 and up  level 3
// ---------------------------------------------------------------------------

const TITLES = { junior: 'The magic door', intermediate: 'The sealed door', senior: 'The sealed door' };
const INTROS = {
  junior: 'Tap the right answer to open the door.',
  intermediate: 'Solve the riddle on the door to open it. You can show your steps.',
  senior: 'Solve the riddle on the door to open it. Show each step.',
};

export function makePuzzle(run, version, floor) {
  return { title: TITLES[version.id], intro: INTROS[version.id], question: pickPuzzleQuestion(run, version, floor) };
}

import { makeIntermediate } from './intermediate';
import { makeJunior } from './junior';
import { makeSenior } from './senior';

// ---------------------------------------------------------------------------
// The game's own sum maker. It always works (no internet needed) and makes
// a fresh sum every time, for the player's own grade:
//
//   makeQuestion({ versionId, grade, topic, level })
//
//   grade  1 to 11 (CAPS). Each grade has its own kinds of sums.
//   topic  the maths area (the dungeon type), e.g. 'algebra'
//   level  1 easy, 2 medium, 3 hard FOR THAT GRADE. Level 1 spells and
//          puzzles low in the tower ask level 1 sums, and so on.
//
// Every answer can be typed on the game's keypad (or tapped, in junior).
// The AI on the server makes extra, more varied sums to the same plan
// (Backend/src/ai/curriculum.js); these are used whenever it has none.
// ---------------------------------------------------------------------------

const MAKERS = { junior: makeJunior, intermediate: makeIntermediate, senior: makeSenior };
const GRADES = { junior: [1, 3], intermediate: [4, 6], senior: [7, 11] };
// When the player hasn't chosen a grade yet
const MIDDLE = { junior: 2, intermediate: 5, senior: 9 };

// The grade to use for a version: the player's own if it fits, else the middle one.
export function gradeFor(versionId, grade) {
  const [low, high] = GRADES[versionId];
  const g = Math.round(Number(grade));
  return g >= low && g <= high ? g : MIDDLE[versionId];
}

export const clampLevel = (level) => Math.max(1, Math.min(3, Math.round(Number(level)) || 1));

export function makeQuestion({ versionId, grade, topic, level = 1 }, rng = Math.random) {
  const q = MAKERS[versionId](topic, gradeFor(versionId, grade), clampLevel(level), rng);
  return { ...q, type: topic, level: clampLevel(level), source: 'bank' };
}

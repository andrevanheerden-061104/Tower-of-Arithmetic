import { GUIDE } from './curriculum.js';

// The three versions of the game, by the same ids the app uses
// (Tower-of-Arithmetic/src/game/versions.js), and how the player answers
// in each one. What each grade covers is in curriculum.js.

export const VERSIONS = {
  junior: {
    grades: 'Grades 1 to 3 (ages 6 to 9)',
    answerMode: 'tap', // the player taps one of three answers
  },
  intermediate: {
    grades: 'Grades 4 to 6 (ages 9 to 12)',
    answerMode: 'type', // the player types the final answer
  },
  senior: {
    grades: 'Grades 7 to 11 (ages 12 to 17)',
    answerMode: 'steps', // the player writes each step of working
  },
};

// The topics the AI makes sums for in a grade. (Geometry and measurement
// are made by the app itself, with a drawing, so they aren't here.)
export function topicsFor(grade) {
  return Object.keys(GUIDE[grade] ?? {});
}

// A quick test that a sum really belongs to its topic, so an "algebra"
// dungeon can never be handed a fractions sum. `d` is the sum as shown.
const has = (pattern) => (d) => pattern.test(d);
const list = /-?\d+\s*,\s*-?\d+\s*,/;
const RULES = {
  // Grades 1-3
  adding: (d) => /\+/.test(d) && !/[×÷−-]/.test(d),
  takingAway: (d) => /[−-]/.test(d) && !/[×÷+]/.test(d),
  times: (d) => /×/.test(d) && !/[÷+−-]/.test(d),
  // Grades 4-6
  multiplication: (d) => /×/.test(d) && !/[÷/]/.test(d),
  division: has(/÷/),
  // Shared names: the grade decides which test is used (see onTopic)
  patterns: (d) => list.test(d) || /\bT|n\b|n\s*=|[×]/i.test(d),
  data: has(/mean|median|mode|range|total|average|quartile|iqr|q1|q3|variance|deviation|σ/i),
  fractions: has(/\d\s*\/\s*\d|\/\s*x|x\s*\/|\)\s*\/|%|\d\.\d|[½¼¾⅓⅔]/),
  // Grades 7-11
  algebra: (d) => /x/i.test(d) && /=/.test(d) && !list.test(d),
  arithmetic: (d) => !/[a-z]/i.test(d.replace(/of/gi, '')) && /[+×÷−\-^√²³⁰-⁹]/.test(d),
};

export function onTopic(topic, display, grade) {
  const d = String(display);
  // Junior patterns are always a list of numbers
  if (topic === 'patterns' && grade <= 3) return list.test(d);
  // Data sums never look like equations to solve, and the other way round
  if (topic !== 'data' && RULES.data(d)) return false;
  return RULES[topic]?.(d) ?? false;
}

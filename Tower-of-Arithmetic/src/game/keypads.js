// The keys on each on-screen keypad, in reading order. Every answer the
// game asks for can be typed with these (the sum makers and the server's
// answer checker both make sure of it).
//   ⌫ deletes, "ok" submits, "next" starts a new step of working.

// Grades 4-6, typing the final answer: whole numbers, fractions (3/4) and
// decimals (2.5)
export const TYPE_KEYS = ['1', '2', '3', '⌫', '4', '5', '6', '/', '7', '8', '9', '.', '0', 'ok'];
export const TYPE_COLUMNS = 4;

// Grades 7-11, writing each step of working
export const STEP_KEYS = [
  '7', '8', '9', '÷', '(', '⌫',
  '4', '5', '6', '×', ')', '^',
  '1', '2', '3', '−', 'x', 'n',
  '0', '.', '/', '+', '=', 'y',
];
export const STEP_COLUMNS = 6;

// Swipe left on the steps keypad for more maths: roots, powers, pi,
// percent, inequalities, degrees and a few more letters.
export const STEP_MORE_KEYS = [
  '√', '²', '³', 'π', '%', '⌫',
  '<', '>', '≤', '≥', '°', '±',
  'a', 'b', 'c', 'm', 'k', 't',
  '[', ']', ':', ',', '∴', 'r',
];

// Grades 4-6, working in steps on a puzzle door
export const PUZZLE_KEYS = ['7', '8', '9', '÷', '⌫', '4', '5', '6', '×', '/', '1', '2', '3', '−', '.', '0', '=', '+', 'next'];
export const PUZZLE_COLUMNS = 5;

// Swipe left on the puzzle keypad (Grades 4-6) for more
export const PUZZLE_MORE_KEYS = ['(', ')', '%', '²', '⌫', '<', '>', ',', ':', '°', '√', '³', 'x', 'n', 'next'];

// Placeholder puzzle rooms: one puzzle per version (matches the Figma screens).

export const PUZZLES = {
  // Grades 1-3: finish the pattern on the magic door
  junior: {
    kind: 'pattern',
    title: 'The magic door',
    question: 'What comes next?',
    sequence: ['circle', 'triangle', 'circle', 'triangle', 'circle'],
    options: ['triangle', 'square', 'circle'],
    answer: 'triangle',
    hints: ['Say the shapes out loud: circle, triangle, circle…', 'After every circle comes a…', 'It has three corners.'],
  },

  // Grades 4-6: a word problem worked out in steps
  intermediate: {
    kind: 'steps',
    title: 'The sealed door',
    question:
      'The door is a rectangle 8 m wide and 5 m high. Gold trim runs all the way around its edge. How long is the trim? Show your steps.',
    width: 8,
    height: 5,
    unit: 'm',
    answer: '26',
    keys: ['1', '2', '3', '+', '4', '5', '6', '−', '7', '8', '9', '×', '⌫', '0', '=', 'next'],
    hints: [
      'The trim goes around all four sides.',
      'Two sides are 8 m and two sides are 5 m: 8 + 8 + 5 + 5.',
      '16 + 10 = ?',
    ],
  },

  // Grades 7-11: a geometry proof, give a reason for each statement
  senior: {
    kind: 'proof',
    title: 'The sealed door',
    question:
      'AB is a diameter of the circle with centre O. C lies on the circle and angle ABC = 35°. Find angle BAC and give a reason for each step.',
    rows: [
      { statement: 'AĈB = 90°', reason: 'Angle in a semicircle' },
      { statement: 'BÂC + 35° + 90° = 180°', reason: 'Angles in a triangle' },
      { statement: 'BÂC = 55°', reason: 'Solve the equation' },
    ],
    reasons: ['Angle in a semicircle', 'Angles in a triangle', 'Angles on a straight line', 'Solve the equation'],
    hints: [
      'An angle drawn from a diameter to the circle is special.',
      'The three angles inside a triangle add up to 180°.',
      'The last line just works out the equation above it.',
    ],
  },
};

export function getPuzzle(version) {
  return PUZZLES[version.id];
}

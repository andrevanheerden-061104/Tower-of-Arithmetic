// Placeholder sums: ONE question per maths type for each version, so every
// fight on that type asks the same sum. Swap in a real question bank later
// (or a generator) without changing the screens: they only read these fields.
//
//   instruction   short line above the sum
//   display       the sum as shown to the player
//   answer        the correct answer (as text)
//   accepted      other ways of writing the answer that also count (senior)
//   choices       three answers to tap (junior)
//   picture       optional visual help (dots, groups or a worked breakdown)
//   steps         example working, shown by the last hint (senior)
//   hints         three Archmage hints, from a nudge to almost the answer

const JUNIOR = {
  adding: {
    instruction: 'How many altogether?',
    display: '7 + 5 = ?',
    answer: '12',
    choices: ['11', '12', '13'],
    picture: { kind: 'dots', groups: [{ count: 7, color: 'gold' }, { count: 5, color: 'pink' }] },
    hints: [
      'Count the yellow dots, then keep counting the pink ones.',
      'Start at 7 and count on 5 more: 8, 9, 10…',
      '7 and 3 make 10. Then 2 more.',
    ],
  },
  takingAway: {
    instruction: 'How many are left?',
    display: '9 − 3 = ?',
    answer: '6',
    choices: ['5', '6', '7'],
    picture: { kind: 'takeAway', total: 9, gone: 3 },
    hints: [
      'Cross out 3 dots. How many are not crossed out?',
      'Start at 9 and count back 3: 8, 7…',
      'Count back one more after 7.',
    ],
  },
  times: {
    instruction: 'How many in 3 groups of 2?',
    display: '3 × 2 = ?',
    answer: '6',
    choices: ['5', '6', '8'],
    picture: { kind: 'groups', groups: 3, each: 2 },
    hints: [
      'There are 3 groups. Each group has 2 dots.',
      'Count in twos: 2, 4…',
      'One more group of 2 after 4.',
    ],
  },
  patterns: {
    instruction: 'What number comes next?',
    display: '2, 4, 6, ?',
    answer: '8',
    choices: ['7', '8', '10'],
    picture: null,
    hints: [
      'Look at how much the numbers grow each time.',
      'Each number is 2 more than the one before.',
      'What is 6 and 2 more?',
    ],
  },
};

const INTERMEDIATE = {
  multiplication: {
    instruction: 'Work it out, then type your answer',
    display: '6 × 24 = ?',
    answer: '144',
    picture: { kind: 'breakdown', parts: ['6 × 20 = 120', '6 × 4 = 24', '120 + 24 = ?'] },
    hints: [
      'Split 24 into 20 and 4.',
      'Work out 6 × 20 and 6 × 4 on their own.',
      'Add 120 and 24.',
    ],
  },
  division: {
    instruction: 'Work it out, then type your answer',
    display: '84 ÷ 4 = ?',
    answer: '21',
    picture: { kind: 'breakdown', parts: ['80 ÷ 4 = 20', '4 ÷ 4 = 1', '20 + 1 = ?'] },
    hints: [
      'Split 84 into 80 and 4.',
      'How many 4s are in 80? How many in 4?',
      'Add 20 and 1.',
    ],
  },
  fractions: {
    instruction: 'Work it out, then type your answer',
    display: '½ of 36 = ?',
    answer: '18',
    picture: { kind: 'breakdown', parts: ['36 shared into 2 equal groups', '30 ÷ 2 = 15', '6 ÷ 2 = 3'] },
    hints: [
      'Half means sharing into 2 equal groups.',
      'Halve 30, then halve 6.',
      'Add 15 and 3.',
    ],
  },
  measurement: {
    instruction: 'Perimeter: add up all four sides',
    display: '8 m by 5 m rectangle = ? m',
    answer: '26',
    picture: { kind: 'breakdown', parts: ['8 + 5 + 8 + 5', '16 + 10', '= ?'] },
    hints: [
      'A rectangle has two long sides and two short sides.',
      'Add 8 + 8 and 5 + 5.',
      'Add 16 and 10.',
    ],
  },
  patterns: {
    instruction: 'Find the rule, then type the next number',
    display: '3, 7, 11, 15, ?',
    answer: '19',
    picture: { kind: 'breakdown', parts: ['3 → 7 is +4', '7 → 11 is +4', '15 + 4 = ?'] },
    hints: [
      'How much bigger is each number than the one before?',
      'The rule is "add 4".',
      'What is 15 + 4?',
    ],
  },
  data: {
    instruction: 'Range = biggest − smallest',
    display: 'Range of 3, 9, 5, 7 = ?',
    answer: '6',
    picture: { kind: 'breakdown', parts: ['Biggest: 9', 'Smallest: 3', '9 − 3 = ?'] },
    hints: [
      'Find the biggest and the smallest number.',
      'The biggest is 9 and the smallest is 3.',
      'Work out 9 − 3.',
    ],
  },
};

const SENIOR = {
  algebra: {
    instruction: 'Solve for x · show each step',
    display: '2x − 4 = 10',
    answer: 'x=7',
    accepted: ['x=7', '7'],
    steps: ['2x = 10 + 4', '2x = 14', 'x = 7'],
    hints: [
      'Look at the −4. When a term crosses to the other side of the equals sign, what must happen to its sign?',
      'Add 4 to both sides: 2x = 14.',
      'Divide both sides by 2.',
    ],
  },
  geometry: {
    instruction: 'Angles in a triangle · find x',
    display: '35° + 90° + x = 180°',
    answer: 'x=55',
    accepted: ['x=55', '55', 'x=55°', '55°'],
    steps: ['125 + x = 180', 'x = 180 − 125', 'x = 55'],
    hints: [
      'The three angles of a triangle add up to 180°.',
      'Add the two angles you know first.',
      'Take 125 away from 180.',
    ],
  },
  fractions: {
    instruction: 'Add · simplify your answer',
    display: '3/4 + 1/8 = ?',
    answer: '7/8',
    accepted: ['7/8'],
    steps: ['6/8 + 1/8', '= 7/8'],
    hints: [
      'The fractions need the same denominator.',
      '3/4 is the same as 6/8.',
      'Add 6/8 and 1/8.',
    ],
  },
  arithmetic: {
    instruction: 'Brackets first · show each step',
    display: '−3 × (4 − 9) = ?',
    answer: '15',
    accepted: ['15', '=15'],
    steps: ['−3 × (−5)', '= 15'],
    hints: [
      'Work out the brackets first.',
      '4 − 9 = −5.',
      'A negative times a negative is positive.',
    ],
  },
  patterns: {
    instruction: 'Tₙ = 3n + 2 · find T₁₀',
    display: 'T₁₀ = 3(10) + 2',
    answer: '32',
    accepted: ['32', '=32', 't10=32'],
    steps: ['3 × 10 + 2', '= 30 + 2', '= 32'],
    hints: [
      'Put n = 10 into the rule.',
      'Multiply before you add.',
      '3 × 10 = 30. Now add 2.',
    ],
  },
  data: {
    instruction: 'Order the data · find the median',
    display: 'Median of 4, 9, 2, 7, 5',
    answer: '5',
    accepted: ['5', '=5'],
    steps: ['2, 4, 5, 7, 9', 'median = 5'],
    hints: [
      'Write the numbers from smallest to biggest.',
      '2, 4, 5, 7, 9',
      'The median is the middle number.',
    ],
  },
};

const BANK = { junior: JUNIOR, intermediate: INTERMEDIATE, senior: SENIOR };

// Which maths type a fight on this floor uses. A focused dungeon always
// uses its type; a mixed dungeon works through the types floor by floor.
export function typeForFloor(version, dungeonTypeId, floor) {
  const ids = version.dungeonTypes.map((t) => t.id);
  if (ids.includes(dungeonTypeId)) return dungeonTypeId;
  return ids[(floor - 1) % ids.length];
}

// The sum for a fight. Junior spells each cast their own kind of sum in a
// mixed dungeon (Flashflame adds, Flash Freeze takes away, Shadow Shard times).
export function getQuestion(version, dungeonTypeId, floor, spell) {
  const bank = BANK[version.id];
  let type = typeForFloor(version, dungeonTypeId, floor);
  if (version.id === 'junior' && dungeonTypeId === 'mixed' && spell?.juniorOp) type = spell.juniorOp;
  return { type, ...bank[type] };
}

// Label for the maths a junior card will cast (shown on the card's tag).
export function juniorOpLabel(version, dungeonTypeId, spell) {
  const type = dungeonTypeId === 'mixed' ? spell.juniorOp : dungeonTypeId;
  return version.dungeonTypes.find((t) => t.id === type);
}

// Tidy up typed working so "X = 7", "x=7" and "x =7 " all match.
export function normalise(text) {
  return String(text)
    .toLowerCase()
    .replace(/\s+/g, '')
    .replace(/−/g, '-')
    .replace(/°/g, '');
}

export function isCorrect(question, input) {
  const given = normalise(input);
  const accepted = [question.answer, ...(question.accepted ?? [])].map(normalise);
  return accepted.includes(given);
}

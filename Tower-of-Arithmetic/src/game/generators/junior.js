import { choices, int, pick } from './helpers';

// ---------------------------------------------------------------------------
// Sums for Grades 1 to 3 (CAPS Foundation Phase). The player taps one of
// three answers, so every answer is a whole number.
//
// Each maker is called as maker(grade, level, rng):
//   grade  1, 2 or 3
//   level  1 (easy), 2 (medium) or 3 (hard) for that grade
// and returns { instruction, display, answer, choices, picture, hints }.
// ---------------------------------------------------------------------------

function dots(a, b) {
  return a + b <= 20 ? { kind: 'dots', groups: [{ count: a, color: 'gold' }, { count: b, color: 'pink' }] } : null;
}

// Hints for adding two numbers, small or big.
function addHints(a, b) {
  const big = Math.max(a, b);
  const small = Math.min(a, b);
  if (a + b <= 20) {
    return [`Start with the bigger number, ${big}.`, `Count on ${small} more from ${big}.`, `It is one more than ${a + b - 1}.`];
  }
  const tensA = a - (a % 10);
  const tensB = b - (b % 10);
  return [
    'Split the numbers up. Add the big parts first, then the ones.',
    `${tensA} + ${tensB} = ${tensA + tensB}. Now add the ones: ${a % 10} + ${b % 10}.`,
    `Add ${tensA + tensB} and ${(a % 10) + (b % 10)}.`,
  ];
}

function add(rng, a, b) {
  return {
    instruction: 'How many altogether?',
    display: `${a} + ${b} = ?`,
    answer: a + b,
    picture: dots(a, b),
    hints: addHints(a, b),
  };
}

function missingAdd(rng, total) {
  const a = int(rng, 1, total - 1);
  return {
    instruction: 'Find the missing number',
    display: `${a} + ? = ${total}`,
    answer: total - a,
    picture: null,
    hints: [`What do you add to ${a} to get ${total}?`, `Count on from ${a} until you reach ${total}.`, `Work out ${total} − ${a}.`],
  };
}

function subHints(a, b) {
  if (a <= 20) {
    return [`Start at ${a}.`, `Count back ${b} from ${a}.`, `It is one less than ${a - b + 1}.`];
  }
  const tens = b - (b % 10);
  return [
    'Take away the tens first, then the ones.',
    tens ? `${a} − ${tens} = ${a - tens}. Now take away ${b % 10} more.` : `Count back ${b} from ${a}.`,
    `It is one less than ${a - b + 1}.`,
  ];
}

function sub(rng, a, b) {
  return {
    instruction: 'How many are left?',
    display: `${a} − ${b} = ?`,
    answer: a - b,
    picture: a <= 20 ? { kind: 'takeAway', total: a, gone: b } : null,
    hints: subHints(a, b),
  };
}

function missingSub(rng, a) {
  const left = int(rng, 1, a - 1);
  return {
    instruction: 'Find the missing number',
    display: `${a} − ? = ${left}`,
    answer: a - left,
    picture: null,
    hints: [`How many were taken away from ${a} to leave ${left}?`, `Count back from ${a} until you reach ${left}.`, `Work out ${a} − ${left}.`],
  };
}

// Two numbers that add up without going over `max`.
function pair(rng, min, max) {
  const total = int(rng, min, max);
  const a = int(rng, 1, total - 1);
  return [a, total - a];
}

// A number with `count` digits that isn't a round ten.
function number(rng, min, max) {
  let n = int(rng, min, max);
  if (n % 10 === 0) n += int(rng, 1, 9);
  return Math.min(n, max);
}

export function adding(grade, level, rng) {
  const plan = {
    1: [
      () => add(rng, ...pair(rng, 3, 10)), // totals to 10
      () => add(rng, int(rng, 6, 10), int(rng, 5, 10)), // totals to 20
      () => missingAdd(rng, int(rng, 8, 20)),
    ],
    2: [
      () => add(rng, int(rng, 6, 9), int(rng, 5, 9)), // bridging ten
      () => (rng() < 0.5 ? add(rng, number(rng, 21, 89), int(rng, 2, 9)) : add(rng, int(rng, 1, 5) * 10, int(rng, 1, 4) * 10)),
      () => {
        const a = number(rng, 12, 60);
        return add(rng, a, number(rng, 11, 99 - a));
      },
    ],
    3: [
      () => {
        const a = number(rng, 15, 60);
        return add(rng, a, number(rng, 11, 99 - a));
      },
      () => add(rng, number(rng, 110, 880), number(rng, 11, 99)),
      () => {
        const a = number(rng, 120, 600);
        return add(rng, a, number(rng, 110, 999 - a));
      },
    ],
  };
  return plan[grade][level - 1]();
}

export function takingAway(grade, level, rng) {
  const plan = {
    1: [
      () => {
        const a = int(rng, 4, 10);
        return sub(rng, a, int(rng, 1, a - 1));
      },
      () => {
        const a = int(rng, 11, 20);
        return sub(rng, a, int(rng, 2, 9));
      },
      () => missingSub(rng, int(rng, 8, 20)),
    ],
    2: [
      () => {
        const a = int(rng, 11, 18);
        return sub(rng, a, int(rng, a - 9, 9)); // bridging ten
      },
      () => (rng() < 0.5 ? sub(rng, number(rng, 25, 99), int(rng, 2, 9)) : sub(rng, int(rng, 5, 9) * 10, int(rng, 1, 4) * 10)),
      () => {
        const a = number(rng, 40, 99);
        return sub(rng, a, number(rng, 11, a - 10));
      },
    ],
    3: [
      () => {
        const a = number(rng, 40, 99);
        return sub(rng, a, number(rng, 11, a - 10));
      },
      () => sub(rng, number(rng, 150, 999), number(rng, 11, 99)),
      () => {
        const a = number(rng, 400, 999);
        return sub(rng, a, number(rng, 110, a - 100));
      },
    ],
  };
  return plan[grade][level - 1]();
}

function groupsOf(rng, groups, each) {
  const small = groups <= 5 && each <= 5 && groups * each <= 20;
  return {
    instruction: `How many in ${groups} groups of ${each}?`,
    display: `${groups} × ${each} = ?`,
    answer: groups * each,
    picture: small ? { kind: 'groups', groups, each } : null,
    hints: [
      `There are ${groups} groups with ${each} in each group.`,
      `Count in ${each}s, ${groups} times: ${each}, ${each * 2}…`,
      `${groups - 1} groups make ${(groups - 1) * each}. Add one more group of ${each}.`,
    ],
  };
}

export function times(grade, level, rng) {
  const plan = {
    1: [
      () => groupsOf(rng, int(rng, 2, 5), 2),
      () => (rng() < 0.7 ? groupsOf(rng, int(rng, 2, 4), 5) : groupsOf(rng, 2, 10)),
      () => groupsOf(rng, int(rng, 3, 5), pick(rng, [5, 10])),
    ],
    2: [
      () => groupsOf(rng, int(rng, 2, 10), pick(rng, [2, 10])),
      () => groupsOf(rng, int(rng, 2, 10), pick(rng, [5, 3])),
      () => (rng() < 0.7 ? groupsOf(rng, int(rng, 3, 10), 4) : groupsOf(rng, int(rng, 6, 10), 3)),
    ],
    3: [
      () => groupsOf(rng, int(rng, 3, 10), pick(rng, [2, 5, 10])),
      () => groupsOf(rng, int(rng, 3, 10), pick(rng, [3, 4])),
      () => groupsOf(rng, pick(rng, [2, 3, 4, 5]), int(rng, 11, 20)), // up to 100
    ],
  };
  return plan[grade][level - 1]();
}

function pattern(rng, start, step) {
  const terms = [0, 1, 2, 3].map((i) => start + i * step);
  const next = start + 4 * step;
  const size = Math.abs(step);
  return {
    instruction: 'What number comes next?',
    display: `${terms.join(', ')}, ?`,
    answer: next,
    picture: null,
    gaps: [1, size, size * 2],
    hints: [
      'Look at how the numbers change each time.',
      step > 0 ? `Each number is ${size} more than the one before.` : `Each number is ${size} less than the one before.`,
      step > 0 ? `What is ${terms[3]} and ${size} more?` : `What is ${terms[3]} take away ${size}?`,
    ],
  };
}

export function patterns(grade, level, rng) {
  const plan = {
    1: [
      () => pattern(rng, int(rng, 1, 12), 1),
      () => (rng() < 0.5 ? pattern(rng, int(rng, 1, 5) * 2, 2) : pattern(rng, int(rng, 1, 5) * 10, 10)),
      () => (rng() < 0.5 ? pattern(rng, int(rng, 1, 6) * 5, 5) : pattern(rng, int(rng, 9, 20), -1)),
    ],
    2: [
      () => {
        const step = pick(rng, [2, 5, 10]);
        return pattern(rng, int(rng, 2, 12) * step, step);
      },
      () => {
        const step = pick(rng, [3, 4]);
        return pattern(rng, int(rng, 1, 10) * step, step);
      },
      () => {
        const step = pick(rng, [2, 5, 10]);
        return pattern(rng, int(rng, 8, 18) * step, -step); // counting back
      },
    ],
    3: [
      () => {
        const step = pick(rng, [20, 25, 50, 100]);
        return pattern(rng, int(rng, 1, 5) * step, step);
      },
      () => {
        const step = pick(rng, [3, 4, 10]);
        return pattern(rng, int(rng, 21, 180), step); // from any number
      },
      () => {
        const step = pick(rng, [3, 4, 20, 50]);
        return pattern(rng, int(rng, 6, 18) * step + (step < 10 ? int(rng, 0, 2) : 0), -step);
      },
    ],
  };
  return plan[grade][level - 1]();
}

const MAKERS = { adding, takingAway, times, patterns };

// Finish a junior sum: the answer as text and three answers to tap.
export function makeJunior(topic, grade, level, rng) {
  const q = MAKERS[topic](grade, level, rng);
  const { gaps, ...rest } = q;
  const size = q.answer >= 100 ? [1, 10, 100] : q.answer > 20 ? [1, 2, 10] : [1, 2, 3];
  return { ...rest, answer: String(q.answer), choices: choices(rng, q.answer, gaps ?? size) };
}

export const JUNIOR_TOPICS = Object.keys(MAKERS);

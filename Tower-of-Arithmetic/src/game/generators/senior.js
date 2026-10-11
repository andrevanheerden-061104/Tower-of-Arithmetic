import { fraction, gcd, int, linear, numbers, pick, plus, show, shuffle, sorted, sum, term } from './helpers';
import { geometry } from './geometry';

// ---------------------------------------------------------------------------
// Sums for Grades 7 to 11 (CAPS Senior Phase and FET mathematics). The
// player writes each step of working; the last step is checked.
//
// Each maker is called as maker(grade, level, rng) and returns
// { instruction, display, answer, steps, hints }. Answers are a number
// ("15", "-3", "7/8") or "x=7", so they can always be typed on the keypad.
// ---------------------------------------------------------------------------

const SOLVE = 'Solve for x · show each step';
const POSITIVE = 'Solve for x, where x > 0';

const SUP = '⁰¹²³⁴⁵⁶⁷⁸⁹';
const SUB = '₀₁₂₃₄₅₆₇₈₉';
const sup = (n) => String(n).split('').map((d) => SUP[d]).join('');
const sub = (n) => String(n).split('').map((d) => SUB[d]).join('');
// A whole number that isn't 0, from −max to max (or 1 to max).
const nonZero = (rng, max, negatives = true) => (negatives && rng() < 0.4 ? -1 : 1) * int(rng, 1, max);
const lcm = (a, b) => (a * b) / gcd(a, b);
const x = (value) => `x=${value}`;

// --- algebra ------------------------------------------------------------------

function oneStep(rng) {
  const a = int(rng, 2, 12);
  const v = int(rng, 2, 15);
  return pick(rng, [
    () => ({
      display: `x + ${a} = ${v + a}`,
      steps: [`x = ${v + a} − ${a}`, `x = ${v}`],
      hints: [`What undoes "+ ${a}"?`, `Subtract ${a} from both sides.`, `x = ${v + a} − ${a}.`],
    }),
    () => ({
      display: `x − ${a} = ${v}`,
      answer: x(v + a),
      steps: [`x = ${v} + ${a}`, `x = ${v + a}`],
      hints: [`What undoes "− ${a}"?`, `Add ${a} to both sides.`, `x = ${v} + ${a}.`],
    }),
    () => ({
      display: `${a}x = ${a * v}`,
      steps: [`x = ${a * v} ÷ ${a}`, `x = ${v}`],
      hints: [`${a}x means ${a} × x. What undoes multiplying?`, `Divide both sides by ${a}.`, `x = ${a * v} ÷ ${a}.`],
    }),
    () => ({
      display: `x/${a} = ${v}`,
      answer: x(a * v),
      steps: [`x = ${v} × ${a}`, `x = ${a * v}`],
      hints: [`x/${a} means x ÷ ${a}. What undoes dividing?`, `Multiply both sides by ${a}.`, `x = ${v} × ${a}.`],
    }),
  ])();
}

function twoStep(rng, negatives) {
  const a = int(rng, 2, 9);
  const v = negatives ? nonZero(rng, 9) : int(rng, 1, 12);
  const b = nonZero(rng, 15);
  const c = a * v + b;
  return {
    display: `${a}x ${plus(b)} = ${show(c)}`,
    answer: x(v),
    steps: [`${a}x = ${show(c)} ${plus(-b)}`, `${a}x = ${show(a * v)}`, `x = ${show(v)}`],
    hints: [
      `Get the x term alone first. What undoes "${plus(b)}"?`,
      `${b > 0 ? 'Subtract' : 'Add'} ${Math.abs(b)} ${b > 0 ? 'from' : 'to'} both sides: ${a}x = ${show(a * v)}.`,
      `Divide both sides by ${a}.`,
    ],
  };
}

function substitution(rng) {
  const a = int(rng, 2, 7);
  const b = nonZero(rng, 9);
  const v = int(rng, 2, 8);
  return {
    instruction: `If x = ${v}, find the value · show each step`,
    display: `${linear(a, b)} = ?`,
    answer: `${a * v + b}`,
    steps: [`${a}(${v}) ${plus(b)}`, `= ${a * v} ${plus(b)}`, `= ${show(a * v + b)}`],
    hints: [`Put ${v} in the place of x.`, `${a}x means ${a} × x, so ${a} × ${v} = ${a * v}.`, `Now work out ${a * v} ${plus(b)}.`],
  };
}

function bothSides(rng, big = false) {
  const a = int(rng, 3, big ? 12 : 9);
  const c = int(rng, 1, a - 1);
  const v = nonZero(rng, big ? 12 : 8);
  const b = nonZero(rng, 12);
  const d = (a - c) * v + b;
  const k = a - c;
  return {
    display: `${linear(a, b)} = ${linear(c, d)}`,
    answer: x(v),
    steps: [`${term(a)} − ${term(c)} = ${show(d)} ${plus(-b)}`, `${term(k)} = ${show(d - b)}`, ...(k === 1 ? [] : [`x = ${show(v)}`])],
    hints: [
      'Collect the x terms on one side and the numbers on the other.',
      `Subtract ${term(c)} from both sides, then ${b > 0 ? 'subtract' : 'add'} ${Math.abs(b)}.`,
      k === 1 ? `That leaves x = ${show(d)} ${plus(-b)}.` : `${term(k)} = ${show(d - b)}. Divide both sides by ${k}.`,
    ],
  };
}

function brackets(rng) {
  const a = int(rng, 2, 6);
  const b = nonZero(rng, 9);
  const v = nonZero(rng, 9);
  return {
    display: `${a}(x ${plus(b)}) = ${show(a * (v + b))}`,
    answer: x(v),
    steps: [`${a}x ${plus(a * b)} = ${show(a * (v + b))}`, `${a}x = ${show(a * v)}`, `x = ${show(v)}`],
    hints: [
      `Multiply out the bracket first: ${a} × x and ${a} × ${show(b)}.`,
      `${a}x ${plus(a * b)} = ${show(a * (v + b))}. Now move ${show(a * b)} across.`,
      `${a}x = ${show(a * v)}. Divide both sides by ${a}.`,
    ],
  };
}

function bracketsBoth(rng) {
  const a = int(rng, 3, 7);
  const c = int(rng, 1, a - 1);
  const b = nonZero(rng, 6);
  const v = nonZero(rng, 9);
  const d = a * (v + b) - c * v;
  const k = a - c;
  return {
    display: `${a}(x ${plus(b)}) = ${linear(c, d)}`,
    answer: x(v),
    steps: [`${a}x ${plus(a * b)} = ${linear(c, d)}`, `${term(k)} = ${show(d - a * b)}`, ...(k === 1 ? [] : [`x = ${show(v)}`])],
    hints: [
      'Multiply out the bracket, then collect the x terms on one side.',
      `${a}x ${plus(a * b)} = ${linear(c, d)}. Subtract ${term(c)} from both sides.`,
      k === 1 ? `Now move ${show(a * b)} across.` : `${term(k)} = ${show(d - a * b)}. Divide both sides by ${k}.`,
    ],
  };
}

function fractionEquation(rng) {
  const a = int(rng, 2, 6);
  const k = nonZero(rng, 8);
  const b = nonZero(rng, 9);
  return {
    display: `x/${a} ${plus(b)} = ${show(k + b)}`,
    answer: x(a * k),
    steps: [`x/${a} = ${show(k + b)} ${plus(-b)}`, `x/${a} = ${show(k)}`, `x = ${show(a * k)}`],
    hints: [`Get x/${a} alone first.`, `x/${a} = ${show(k)}. What undoes dividing by ${a}?`, `Multiply both sides by ${a}.`],
  };
}

// x² + bx + c with the terms written neatly.
function quadratic(a, b, c) {
  const first = a === 1 ? 'x²' : `${a}x²`;
  const middle = b === 0 ? '' : ` ${b < 0 ? '−' : '+'} ${Math.abs(b) === 1 ? '' : Math.abs(b)}x`;
  const last = c === 0 ? '' : ` ${plus(c)}`;
  return `${first}${middle}${last}`;
}

function squareEquation(rng) {
  const n = int(rng, 4, 13);
  return {
    instruction: POSITIVE,
    display: `x² = ${n * n}`,
    answer: x(n),
    steps: [`x = √${n * n}`, `x = ${n}`],
    hints: ['What undoes squaring a number?', `Take the square root of both sides.`, `Which number times itself makes ${n * n}?`],
  };
}

function quadFactor(rng, max) {
  const r = int(rng, 1, max);
  let s = int(rng, 1, max);
  if (s === r) s += 1;
  return {
    instruction: POSITIVE,
    display: `${quadratic(1, s - r, -r * s)} = 0`,
    answer: x(r),
    steps: [`(x − ${r})(x + ${s}) = 0`, `x = ${r} or x = −${s}`, `x = ${r}`],
    hints: [
      `Factorise: find two numbers that multiply to ${show(-r * s)} and add to ${show(s - r)}.`,
      `The numbers are ${show(-r)} and ${s}: (x − ${r})(x + ${s}) = 0.`,
      'Each bracket can be 0. Choose the answer that is bigger than 0.',
    ],
  };
}

function quadRearrange(rng) {
  const r = int(rng, 3, 9);
  let s = int(rng, 1, 6);
  if (s === r) s += 1;
  return {
    instruction: POSITIVE,
    display: `x² = ${linear(r - s, r * s)}`,
    answer: x(r),
    steps: [`${quadratic(1, s - r, -r * s)} = 0`, `(x − ${r})(x + ${s}) = 0`, `x = ${r} or x = −${s}`, `x = ${r}`],
    hints: [
      'Move every term to the left so the right side is 0.',
      `${quadratic(1, s - r, -r * s)} = 0. Now factorise.`,
      `(x − ${r})(x + ${s}) = 0. Choose the answer that is bigger than 0.`,
    ],
  };
}

function quadLeading(rng) {
  const a = pick(rng, [2, 3]);
  const p = int(rng, 1, 6);
  let q = int(rng, 1, 5);
  if (q % a === 0) q += 1;
  return {
    instruction: POSITIVE,
    display: `${quadratic(a, q - a * p, -p * q)} = 0`,
    answer: x(p),
    steps: [`(${a}x + ${q})(x − ${p}) = 0`, `x = −${q}/${a} or x = ${p}`, `x = ${p}`],
    hints: [
      `Factorise into two brackets. The first terms must multiply to ${a}x².`,
      `(${a}x + ${q})(x − ${p}) = 0.`,
      'Each bracket can be 0. Choose the answer that is bigger than 0.',
    ],
  };
}

function simultaneous(rng) {
  const b = int(rng, 1, 8);
  const a = b + int(rng, 1, 8);
  return {
    instruction: 'Solve simultaneously · find x',
    display: `x + y = ${a + b} and x − y = ${a - b}`,
    answer: x(a),
    steps: [`2x = ${a + b} + ${a - b}`, `2x = ${2 * a}`, `x = ${a}`],
    hints: ['Add the two equations. What happens to y?', `+y and −y cancel: 2x = ${2 * a}.`, 'Divide both sides by 2.'],
  };
}

function exponential(rng, shifted) {
  const base = pick(rng, [2, 3, 5]);
  const n = int(rng, 2, base === 2 ? 6 : base === 3 ? 4 : 3);
  const value = base ** n;
  if (!shifted) {
    return {
      display: `${base}^x = ${value}`,
      answer: x(n),
      steps: [`${base}^x = ${base}^${n}`, `x = ${n}`],
      hints: [`Write ${value} as a power of ${base}.`, `${value} = ${base}^${n}.`, 'The bases are the same, so the exponents are equal.'],
    };
  }
  const k = nonZero(rng, 3);
  return {
    display: `${base}^(x ${plus(k)}) = ${value}`,
    answer: x(n - k),
    steps: [`${base}^(x ${plus(k)}) = ${base}^${n}`, `x ${plus(k)} = ${n}`, `x = ${show(n - k)}`],
    hints: [`Write ${value} as a power of ${base}.`, `${value} = ${base}^${n}, so the exponents are equal: x ${plus(k)} = ${n}.`, `Move ${show(k)} to the other side.`],
  };
}

export function algebra(grade, level, rng) {
  const plan = {
    7: [() => oneStep(rng), () => twoStep(rng, false), () => substitution(rng)],
    8: [() => twoStep(rng, true), () => bothSides(rng), () => brackets(rng)],
    9: [() => bracketsBoth(rng), () => fractionEquation(rng), () => (rng() < 0.4 ? squareEquation(rng) : quadFactor(rng, 5))],
    10: [() => bothSides(rng, true), () => quadFactor(rng, 9), () => (rng() < 0.5 ? simultaneous(rng) : exponential(rng, false))],
    11: [() => quadRearrange(rng), () => quadLeading(rng), () => exponential(rng, true)],
  };
  const q = plan[grade][level - 1]();
  // One-step sums leave the answer out when it is just the value of x
  if (!q.answer) q.answer = q.steps.at(-1).replace(/\s+/g, '').replace('−', '-');
  return { instruction: SOLVE, ...q };
}

// --- fractions ----------------------------------------------------------------

const SIMPLIFY = 'Work it out · give the simplest form';

function fracSame(rng) {
  for (;;) {
    const d = pick(rng, [6, 8, 9, 10, 12, 15]);
    const a = int(rng, 1, d - 1);
    const b = int(rng, 1, d - 1);
    const add = rng() < 0.5;
    const top = add ? a + b : a - b;
    if (top <= 0 || top === d) continue;
    const answer = fraction(top, d);
    return {
      display: `${a}/${d} ${add ? '+' : '−'} ${b}/${d} = ?`,
      answer,
      steps: [`= (${a} ${add ? '+' : '−'} ${b})/${d}`, `= ${top}/${d}`, ...(answer === `${top}/${d}` ? [] : [`= ${answer}`])],
      hints: [
        'The denominators are the same, so only the numerators change.',
        `${a} ${add ? '+' : '−'} ${b} = ${top}, over ${d}.`,
        answer === `${top}/${d}` ? `Write ${top} over ${d}.` : `Simplify ${top}/${d} by dividing top and bottom by ${gcd(top, d)}.`,
      ],
    };
  }
}

function fracUnlike(rng, negatives = false) {
  for (;;) {
    const b = pick(rng, [2, 3, 4, 5, 6, 8]);
    const d = pick(rng, [3, 4, 5, 6, 8, 10, 12]);
    if (b === d) continue;
    const a = int(rng, 1, b - 1);
    const c = int(rng, 1, d - 1);
    if (gcd(a, b) !== 1 || gcd(c, d) !== 1) continue;
    const L = lcm(b, d);
    if (L > 40) continue;
    const add = rng() < 0.5;
    const first = (negatives ? -a : a) * (L / b);
    const second = c * (L / d);
    const top = add ? first + second : first - second;
    if (top === 0 || (!negatives && top < 0)) continue;
    const answer = fraction(top, L);
    return {
      display: `${negatives ? '−' : ''}${a}/${b} ${add ? '+' : '−'} ${c}/${d} = ?`,
      answer,
      steps: [`= ${show(first)}/${L} ${add ? '+' : '−'} ${second}/${L}`, `= ${show(top)}/${L}`, ...(answer === `${top}/${L}` ? [] : [`= ${answer.replace('-', '−')}`])],
      hints: [
        `The denominators must match. What is the smallest number that ${b} and ${d} both go into?`,
        `Use ${L}: ${a}/${b} = ${a * (L / b)}/${L} and ${c}/${d} = ${second}/${L}.`,
        `${add ? 'Add' : 'Subtract'} the numerators${negatives ? ' (watch the minus sign)' : ''}, then simplify if you can.`,
      ],
    };
  }
}

function fracTimes(rng, divide) {
  for (;;) {
    const [a, b, c, d] = [int(rng, 1, 7), int(rng, 2, 9), int(rng, 1, 7), int(rng, 2, 9)];
    if (a >= b || gcd(a, b) !== 1 || gcd(c, d) !== 1 || c === d) continue;
    // a/b ÷ c/d is a/b × d/c
    const [n, m] = divide ? [d, c] : [c, d];
    const answer = fraction(a * n, b * m);
    return {
      display: `${a}/${b} ${divide ? '÷' : '×'} ${c}/${d} = ?`,
      answer,
      steps: [
        ...(divide ? [`= ${a}/${b} × ${d}/${c}`] : []),
        `= (${a} × ${n})/(${b} × ${m})`,
        `= ${a * n}/${b * m}`,
        ...(answer === `${a * n}/${b * m}` ? [] : [`= ${answer}`]),
      ],
      hints: [
        divide ? 'Dividing by a fraction is the same as multiplying by it flipped over.' : 'Multiply the tops together and the bottoms together.',
        divide ? `${a}/${b} × ${d}/${c}.` : `(${a} × ${c}) over (${b} × ${d}).`,
        `That gives ${a * n}/${b * m}. Simplify if you can.`,
      ],
    };
  }
}

function fracBodmas(rng) {
  for (;;) {
    const [a, b] = pick(rng, [[1, 2], [1, 3], [1, 4], [3, 4], [2, 3], [1, 6]]);
    const [c, d] = pick(rng, [[1, 2], [2, 3], [3, 4], [1, 3]]);
    const [e, f] = pick(rng, [[1, 2], [3, 4], [2, 5], [4, 3], [3, 2]]);
    const pn = c * e;
    const pd = d * f;
    const top = a * pd + pn * b;
    const answer = fraction(top, b * pd);
    if (answer.length > 5) continue;
    return {
      display: `${a}/${b} + ${c}/${d} × ${e}/${f} = ?`,
      answer,
      steps: [`${c}/${d} × ${e}/${f} = ${fraction(pn, pd)}`, `${a}/${b} + ${fraction(pn, pd)}`, `= ${answer}`],
      hints: ['Which comes first: adding or multiplying?', `Multiply first: ${c}/${d} × ${e}/${f} = ${fraction(pn, pd)}.`, `Now add ${a}/${b} and ${fraction(pn, pd)} using a common denominator.`],
    };
  }
}

// x/a ± x/b = c
function xOverBoth(rng, subtract) {
  const [a, b] = pick(rng, subtract ? [[2, 3], [2, 4], [3, 4], [2, 5], [3, 6], [4, 6]] : [[2, 3], [2, 4], [3, 6], [2, 6], [4, 4], [2, 5]]);
  const L = lcm(a, b);
  const v = L * nonZero(rng, 4, false);
  const c = subtract ? v / a - v / b : v / a + v / b;
  const k = subtract ? L / a - L / b : L / a + L / b;
  return {
    instruction: SOLVE,
    display: `x/${a} ${subtract ? '−' : '+'} x/${b} = ${c}`,
    answer: x(v),
    steps: [`${term(L / a)} ${subtract ? '−' : '+'} ${term(L / b)} = ${c * L}`, `${term(k)} = ${c * L}`, ...(k === 1 ? [] : [`x = ${v}`])],
    hints: [`Multiply every term by ${L} to clear the fractions.`, `${term(L / a)} ${subtract ? '−' : '+'} ${term(L / b)} = ${c * L}.`, k === 1 ? 'Collect the x terms.' : `${term(k)} = ${c * L}. Divide both sides by ${k}.`],
  };
}

function linearOverNumber(rng) {
  const b = int(rng, 2, 6);
  const a = nonZero(rng, 9);
  const c = nonZero(rng, 8);
  return {
    instruction: SOLVE,
    display: `(x ${plus(a)})/${b} = ${show(c)}`,
    answer: x(b * c - a),
    steps: [`x ${plus(a)} = ${show(c)} × ${b}`, `x ${plus(a)} = ${show(b * c)}`, `x = ${show(b * c - a)}`],
    hints: [`Multiply both sides by ${b} to clear the fraction.`, `x ${plus(a)} = ${show(b * c)}.`, `Move ${show(a)} to the other side.`],
  };
}

// (px + q)/m = (rx + s)/n
function crossMultiply(rng) {
  for (;;) {
    const [m, n] = pick(rng, [[2, 3], [3, 2], [3, 4], [4, 3], [2, 5], [5, 2]]);
    const p = int(rng, 1, 3);
    const r = int(rng, 1, 2);
    const v = nonZero(rng, 7);
    const t = nonZero(rng, 5);
    const q = m * t - p * v;
    const s = n * t - r * v;
    const k = n * p - m * r;
    if (k <= 0 || q === 0 || s === 0 || Math.abs(q) > 15 || Math.abs(s) > 15) continue;
    return {
      instruction: SOLVE,
      display: `(${linear(p, q)})/${m} = (${linear(r, s)})/${n}`,
      answer: x(v),
      steps: [`${n}(${linear(p, q)}) = ${m}(${linear(r, s)})`, `${linear(n * p, n * q)} = ${linear(m * r, m * s)}`, `${term(k)} = ${show(m * s - n * q)}`, ...(k === 1 ? [] : [`x = ${show(v)}`])],
      hints: ['Cross-multiply to clear both fractions.', `${n}(${linear(p, q)}) = ${m}(${linear(r, s)}). Multiply out the brackets.`, 'Collect the x terms on one side and the numbers on the other.'],
    };
  }
}

function numberOverX(rng) {
  const b = int(rng, 2, 9);
  const v = int(rng, 2, 9);
  return {
    instruction: SOLVE,
    display: `${b * v}/x = ${b}`,
    answer: x(v),
    steps: [`${b * v} = ${b}x`, `x = ${b * v} ÷ ${b}`, `x = ${v}`],
    hints: ['x is in the denominator. Multiply both sides by x.', `${b * v} = ${b}x.`, `Divide both sides by ${b}.`],
  };
}

function unitFractions(rng) {
  // 1/x + 1/a = 1/b
  const [a, b, v] = pick(rng, [[6, 3, 6], [4, 2, 4], [12, 4, 6], [6, 2, 3], [12, 3, 4], [20, 4, 5], [30, 5, 6], [12, 6, 12]]);
  return {
    instruction: SOLVE,
    display: `1/x + 1/${a} = 1/${b}`,
    answer: x(v),
    steps: [`1/x = 1/${b} − 1/${a}`, `1/x = ${a / b}/${a} − 1/${a}`, `1/x = ${fraction(a / b - 1, a)}`, `x = ${v}`],
    hints: [`Get 1/x alone: subtract 1/${a} from both sides.`, `1/${b} − 1/${a} = ${fraction(a / b - 1, a)}.`, `If 1/x = 1/${v}, what is x?`],
  };
}

export function fractions(grade, level, rng) {
  const plan = {
    7: [() => fracSame(rng), () => fracUnlike(rng), () => fracTimes(rng, false)],
    8: [() => fracUnlike(rng), () => fracTimes(rng, rng() < 0.5), () => fracUnlike(rng, true)],
    9: [() => fracTimes(rng, true), () => fracBodmas(rng), () => xOverBoth(rng, false)],
    10: [() => linearOverNumber(rng), () => xOverBoth(rng, true), () => crossMultiply(rng)],
    11: [() => xOverBoth(rng, rng() < 0.5), () => numberOverX(rng), () => unitFractions(rng)],
  };
  const q = plan[grade][level - 1]();
  return { instruction: SIMPLIFY, simplest: !q.answer.startsWith('x='), ...q };
}

// --- arithmetic: integers, order of operations, exponents and surds ------------

const STEPS = 'Work it out · show each step';
const neg = (n) => (n < 0 ? `(${show(n)})` : `${n}`); // a negative number in brackets

function bodmas(rng) {
  const [a, b, c, d] = [int(rng, 2, 12), int(rng, 2, 9), int(rng, 2, 9), int(rng, 2, 6)];
  return pick(rng, [
    () => ({ display: `${a} + ${b} × ${c} = ?`, answer: a + b * c, steps: [`= ${a} + ${b * c}`, `= ${a + b * c}`], first: `${b} × ${c}` }),
    () => ({ display: `(${a} + ${b}) × ${c} − ${d} = ?`, answer: (a + b) * c - d, steps: [`= ${a + b} × ${c} − ${d}`, `= ${(a + b) * c} − ${d}`, `= ${(a + b) * c - d}`], first: `(${a} + ${b})` }),
    () => ({ display: `${a * d} ÷ ${d} + ${b} × ${c} = ?`, answer: a + b * c, steps: [`= ${a} + ${b * c}`, `= ${a + b * c}`], first: `${a * d} ÷ ${d} and ${b} × ${c}` }),
  ])();
}

function integersAddSub(rng) {
  const a = int(rng, 2, 15);
  const b = int(rng, 2, 15);
  return pick(rng, [
    () => ({ display: `−${a} + ${b + a} = ?`, answer: b, steps: [`= ${b + a} − ${a}`, `= ${b}`], first: 'Start at the negative number and count up' }),
    () => ({ display: `${a} − (−${b}) = ?`, answer: a + b, steps: [`= ${a} + ${b}`, `= ${a + b}`], first: 'Subtracting a negative is the same as adding' }),
    () => ({ display: `−${a} − ${b} = ?`, answer: -(a + b), steps: [`= −(${a} + ${b})`, `= −${a + b}`], first: 'You are already below zero and going further down' }),
    () => ({ display: `${a} − ${a + b} = ?`, answer: -b, steps: [`= −(${a + b} − ${a})`, `= −${b}`], first: 'You are taking away more than you have, so the answer is negative' }),
  ])();
}

function powersRoots(rng) {
  const a = int(rng, 2, 9);
  const r = int(rng, 2, 12);
  const c = int(rng, 1, 9);
  const small = int(rng, 2, 4);
  return pick(rng, [
    () => ({ display: `${a}² + √${r * r} = ?`, answer: a * a + r, steps: [`= ${a * a} + ${r}`, `= ${a * a + r}`], first: `${a}² means ${a} × ${a}, and √${r * r} is the number that squares to ${r * r}` }),
    () => ({ display: `${small}³ − ${c} = ?`, answer: small ** 3 - c, steps: [`= ${small ** 3} − ${c}`, `= ${small ** 3 - c}`], first: `${small}³ means ${small} × ${small} × ${small}` }),
    () => ({ display: `√${r * r} × ${small}² = ?`, answer: r * small * small, steps: [`= ${r} × ${small * small}`, `= ${r * small * small}`], first: `Work out the root and the square before multiplying` }),
  ])();
}

function integersMulDiv(rng) {
  const a = int(rng, 2, 9);
  const b = int(rng, 2, 9);
  return pick(rng, [
    () => ({ display: `−${a} × ${b} = ?`, answer: -a * b, steps: [`= −(${a} × ${b})`, `= −${a * b}`], first: 'A negative times a positive is negative' }),
    () => ({ display: `−${a} × (−${b}) = ?`, answer: a * b, steps: [`= ${a} × ${b}`, `= ${a * b}`], first: 'A negative times a negative is positive' }),
    () => ({ display: `−${a * b} ÷ ${a} = ?`, answer: -b, steps: [`= −(${a * b} ÷ ${a})`, `= −${b}`], first: 'A negative divided by a positive is negative' }),
    () => ({ display: `${a * b} ÷ (−${a}) = ?`, answer: -b, steps: [`= −(${a * b} ÷ ${a})`, `= −${b}`], first: 'A positive divided by a negative is negative' }),
  ])();
}

function bodmasNegative(rng, harder) {
  const a = int(rng, 2, 6);
  const b = int(rng, 2, 9);
  const c = b + int(rng, 1, 8);
  const d = int(rng, 2, 9);
  if (!harder) {
    return pick(rng, [
      () => ({ display: `−${a} × (${b} − ${c}) = ?`, answer: -a * (b - c), steps: [`= −${a} × (−${c - b})`, `= ${a * (c - b)}`], first: `Brackets first: ${b} − ${c} = −${c - b}` }),
      () => ({ display: `${d} − ${a} × (−${b}) = ?`, answer: d + a * b, steps: [`= ${d} − (−${a * b})`, `= ${d} + ${a * b}`, `= ${d + a * b}`], first: `Multiply first: ${a} × (−${b}) = −${a * b}` }),
    ])();
  }
  return pick(rng, [
    () => ({ display: `(${b} − ${c}) × ${a} − ${d} = ?`, answer: (b - c) * a - d, steps: [`= −${c - b} × ${a} − ${d}`, `= −${(c - b) * a} − ${d}`, `= −${(c - b) * a + d}`], first: `Brackets first: ${b} − ${c} = −${c - b}` }),
    () => ({ display: `−${a}² + ${d} × (−${b}) = ?`, answer: -a * a - d * b, steps: [`= −${a * a} + (−${d * b})`, `= −${a * a + d * b}`], first: `−${a}² means −(${a} × ${a}) = −${a * a}` }),
    () => ({ display: `${a * b} ÷ (−${a}) − (−${d}) = ?`, answer: -b + d, steps: [`= −${b} − (−${d})`, `= −${b} + ${d}`, `= ${show(d - b)}`], first: `Divide first: ${a * b} ÷ (−${a}) = −${b}` }),
  ])();
}

function powersNegative(rng) {
  const c = int(rng, 1, 12);
  const [p, q] = [int(rng, 1, 3), int(rng, 1, 3)];
  const base = pick(rng, [2, 3]);
  return pick(rng, [
    () => ({ display: `(−2)³ + ${c} = ?`, answer: -8 + c, steps: [`= −8 + ${c}`, `= ${show(c - 8)}`], first: '(−2)³ = (−2) × (−2) × (−2) = −8' }),
    () => ({ display: `(−3)² − ${c} = ?`, answer: 9 - c, steps: [`= 9 − ${c}`, `= ${show(9 - c)}`], first: '(−3)² = (−3) × (−3) = 9' }),
    () => ({ display: `${base}${sup(p)} × ${base}${sup(q)} = ?`, answer: base ** (p + q), steps: [`= ${base}^(${p} + ${q})`, `= ${base}${sup(p + q)}`, `= ${base ** (p + q)}`], first: 'Same base: when you multiply, add the exponents' }),
  ])();
}

function exponentLaws(rng, withThird) {
  const base = pick(rng, [2, 3, 5]);
  const q = int(rng, 1, 3);
  const p = q + int(rng, 1, base === 2 ? 4 : 2);
  if (withThird) {
    return { display: `${base}${sup(p + 1)} ÷ ${base}${sup(q + 1)} × ${base} = ?`, answer: base ** (p - q + 1), steps: [`= ${base}^(${p + 1} − ${q + 1} + 1)`, `= ${base}${sup(p - q + 1)}`, `= ${base ** (p - q + 1)}`], first: 'Same base: subtract exponents when dividing, add them when multiplying' };
  }
  return pick(rng, [
    () => ({ display: `${base}${sup(p + 2)} ÷ ${base}${sup(q + 2)} = ?`, answer: base ** (p - q), steps: [`= ${base}^(${p + 2} − ${q + 2})`, `= ${base}${sup(p - q)}`, `= ${base ** (p - q)}`], first: 'Same base: when you divide, subtract the exponents' }),
    () => ({ display: `(${base}²)² = ?`, answer: base ** 4, steps: [`= ${base}^(2 × 2)`, `= ${base}⁴`, `= ${base ** 4}`], first: 'A power of a power: multiply the exponents' }),
  ])();
}

function negativeExponent(rng) {
  const base = pick(rng, [2, 3, 4, 5]);
  const n = base === 2 ? int(rng, 1, 4) : int(rng, 1, 2);
  return pick(rng, [
    () => ({ display: `${base}^(−${n}) = ?`, answer: `1/${base ** n}`, steps: [`= 1/${base}${n === 1 ? '' : sup(n)}`, `= 1/${base ** n}`], first: 'A negative exponent means "one over" the power' }),
    () => ({ display: `${base}^(−1) × ${base * base * 2} = ?`, answer: base * 2, steps: [`= 1/${base} × ${base * base * 2}`, `= ${base * 2}`], first: `${base}^(−1) is the same as 1/${base}` }),
    () => ({ display: `${base}⁰ + ${base}^(−1) = ?`, answer: fraction(base + 1, base), steps: [`= 1 + 1/${base}`, `= ${base + 1}/${base}`], first: `Anything to the power 0 is 1, and ${base}^(−1) = 1/${base}` }),
  ])();
}

function rationalExponent(rng, simple) {
  const table = [
    [8, 1, 3, 2], [27, 1, 3, 3], [16, 1, 2, 4], [16, 1, 4, 2], [25, 1, 2, 5], [64, 1, 3, 4], [81, 1, 4, 3], [32, 1, 5, 2],
    [8, 2, 3, 2], [27, 2, 3, 3], [16, 3, 4, 2], [4, 3, 2, 2], [9, 3, 2, 3], [32, 2, 5, 2], [81, 3, 4, 3], [64, 2, 3, 4], [125, 2, 3, 5], [25, 3, 2, 5],
  ];
  const [n, top, bottom, root] = pick(rng, table.filter((row) => (simple ? row[1] === 1 : row[1] > 1)));
  return {
    display: `${n}^(${top}/${bottom}) = ?`,
    answer: root ** top,
    steps: [`${n} = ${root}${sup(bottom)}`, `(${root}${sup(bottom)})^(${top}/${bottom}) = ${root}${top === 1 ? '' : sup(top)}`, `= ${root ** top}`],
    first: `Write ${n} as a power: ${n} = ${root}${sup(bottom)}`,
  };
}

function surds(rng) {
  if (rng() < 0.5) {
    const [a, b] = pick(rng, [[12, 3], [18, 2], [8, 2], [27, 3], [20, 5], [32, 2], [50, 2], [45, 5], [24, 6]]);
    return { display: `√${a} × √${b} = ?`, answer: Math.sqrt(a * b), steps: [`= √(${a} × ${b})`, `= √${a * b}`, `= ${Math.sqrt(a * b)}`], first: '√a × √b = √(a × b)' };
  }
  const [a, b, v] = pick(rng, [[50, 2, 5], [75, 3, 5], [48, 3, 4], [72, 2, 6], [98, 2, 7], [80, 5, 4], [45, 5, 3], [32, 2, 4]]);
  return { display: `√${a} ÷ √${b} = ?`, answer: v, steps: [`= √(${a} ÷ ${b})`, `= √${a / b}`, `= ${v}`], first: '√a ÷ √b = √(a ÷ b)' };
}

function surdSquare(rng) {
  const [a, b] = pick(rng, [[8, 2], [12, 3], [18, 2], [27, 3], [20, 5]]);
  const cross = 2 * Math.sqrt(a * b);
  return {
    display: `(√${a} + √${b})² = ?`,
    answer: a + b + cross,
    steps: [`= ${a} + 2√(${a} × ${b}) + ${b}`, `= ${a} + 2√${a * b} + ${b}`, `= ${a} + ${cross} + ${b}`, `= ${a + b + cross}`],
    first: '(p + q)² = p² + 2pq + q²',
  };
}

export function arithmetic(grade, level, rng) {
  const plan = {
    7: [() => bodmas(rng), () => integersAddSub(rng), () => powersRoots(rng)],
    8: [() => integersMulDiv(rng), () => bodmasNegative(rng, false), () => powersNegative(rng)],
    9: [() => bodmasNegative(rng, true), () => exponentLaws(rng, false), () => negativeExponent(rng)],
    10: [() => exponentLaws(rng, true), () => rationalExponent(rng, true), () => surds(rng)],
    11: [() => rationalExponent(rng, false), () => surds(rng), () => surdSquare(rng)],
  };
  const { first, ...q } = plan[grade][level - 1]();
  return {
    instruction: STEPS,
    ...q,
    answer: String(q.answer),
    hints: [
      grade >= 9 ? 'Which exponent or surd rule fits this sum?' : 'What must be worked out first? Think of the order of operations and the signs.',
      `${first}.`,
      `Your next line should be: ${q.steps[0].replace(/^= /, '')}.`,
    ],
  };
}

// --- number patterns ------------------------------------------------------------

const tn = (k) => `T${typeof k === 'number' ? sub(k) : 'ₙ'}`;

function linearTerms(rng, grade) {
  const d = (grade >= 9 && rng() < 0.3 ? -1 : 1) * int(rng, 2, grade >= 9 ? 12 : 8);
  const first = d > 0 ? int(rng, 1, 15) : int(rng, 30, 90);
  return { d, first, c: first - d, terms: [0, 1, 2, 3].map((i) => first + i * d) };
}

function nextTerm(rng, grade) {
  const { d, terms } = linearTerms(rng, grade);
  return {
    instruction: 'Find the next term · show each step',
    display: `${terms.map(show).join(', ')}, ?`,
    answer: terms[3] + d,
    steps: [`difference = ${show(d)}`, `${show(terms[3])} ${plus(d)} = ${show(terms[3] + d)}`],
    hints: ['What is added (or subtracted) each time?', `The constant difference is ${show(d)}.`, `Work out ${show(terms[3])} ${plus(d)}.`],
  };
}

function ruleTerm(rng, maxK) {
  const a = int(rng, 2, 9);
  const b = nonZero(rng, 9);
  const k = int(rng, 5, maxK);
  return {
    instruction: `${tn()} = ${linear(a, b, 'n')} · find ${tn(k)}`,
    display: `${tn(k)} = ?`,
    answer: a * k + b,
    steps: [`${tn(k)} = ${a}(${k}) ${plus(b)}`, `= ${a * k} ${plus(b)}`, `= ${a * k + b}`],
    hints: [`Put n = ${k} into the rule.`, `${a}n means ${a} × n: ${a} × ${k} = ${a * k}.`, `Now work out ${a * k} ${plus(b)}.`],
  };
}

function sequenceTerm(rng, grade, k) {
  const { d, c, terms } = linearTerms(rng, grade);
  return {
    instruction: `Find the rule, then ${tn(k)}`,
    display: `${terms.map(show).join(', ')}, … ${tn(k)} = ?`,
    answer: d * k + c,
    steps: [`d = ${show(d)}, so ${tn()} = ${linear(d, c, 'n')}`, `${tn(k)} = ${show(d)}(${k}) ${plus(c)}`, `= ${show(d * k + c)}`],
    hints: [`The difference is ${show(d)}, so the rule starts with ${term(d, 'n')}.`, `Check with term 1: ${tn()} = ${linear(d, c, 'n')}.`, `Put n = ${k} into the rule.`],
  };
}

function findN(rng, grade, fromSequence) {
  const { d, c, terms } = linearTerms(rng, grade === 8 ? 8 : grade);
  const n = int(rng, 8, grade >= 10 ? 60 : 30);
  const value = d * n + c;
  const rule = linear(d, c, 'n');
  return {
    instruction: fromSequence ? `Which term of the pattern is ${show(value)}?` : `${tn()} = ${rule} · which term is ${show(value)}?`,
    display: fromSequence ? `${terms.map(show).join(', ')}, … n = ?` : `${rule} = ${show(value)}`,
    answer: n,
    accepted: [`n=${n}`, `x=${n}`],
    steps: [...(fromSequence ? [`${tn()} = ${rule}`] : []), `${rule} = ${show(value)}`, `${term(d, 'n')} = ${show(value - c)}`, `n = ${n}`],
    hints: [
      fromSequence ? `First find the rule: the difference is ${show(d)}, so ${tn()} = ${rule}.` : 'Set the rule equal to the value and solve for n.',
      `${rule} = ${show(value)}. Move ${show(c)} across: ${term(d, 'n')} = ${show(value - c)}.`,
      `Divide both sides by ${show(d)}.`,
    ],
  };
}

function geometricNext(rng) {
  const r = pick(rng, [2, 3, 4, 5]);
  const a = int(rng, 1, 6);
  const terms = [0, 1, 2, 3].map((i) => a * r ** i);
  return {
    instruction: 'Find the next term · show each step',
    display: `${terms.join(', ')}, ?`,
    answer: a * r ** 4,
    steps: [`ratio = ${terms[1]} ÷ ${terms[0]} = ${r}`, `${terms[3]} × ${r} = ${a * r ** 4}`],
    hints: ['The differences are not the same. Try dividing each term by the one before.', `Each term is ${r} times the one before.`, `Work out ${terms[3]} × ${r}.`],
  };
}

function quadraticPattern(rng) {
  const a = int(rng, 1, 3);
  const b = int(rng, -3, 3);
  const c = int(rng, -2, 5);
  const t = (n) => a * n * n + b * n + c;
  return { a, b, c, t, terms: [1, 2, 3, 4].map(t), diffs: [1, 2, 3].map((n) => t(n + 1) - t(n)) };
}

function quadraticNext(rng, sixth) {
  const { a, t, terms, diffs } = quadraticPattern(rng);
  const fourth = diffs[2] + 2 * a;
  if (!sixth) {
    return {
      instruction: 'Quadratic pattern · find the next term',
      display: `${terms.map(show).join(', ')}, ?`,
      answer: t(5),
      steps: [`first differences: ${diffs.map(show).join(', ')}`, `second difference = ${2 * a}`, `next difference = ${show(diffs[2])} + ${2 * a} = ${show(fourth)}`, `${show(terms[3])} ${plus(fourth)} = ${show(t(5))}`],
      hints: ['Write down the differences between the terms. Are they constant?', `The first differences are ${diffs.map(show).join(', ')}: they go up by ${2 * a} each time.`, `The next difference is ${show(fourth)}. Add it to ${show(terms[3])}.`],
    };
  }
  return {
    instruction: `Quadratic pattern · find ${tn(6)}`,
    display: `${terms.map(show).join(', ')}, … ${tn(6)} = ?`,
    answer: t(6),
    steps: [`first differences: ${diffs.map(show).join(', ')}`, `second difference = ${2 * a}`, `${tn(5)} = ${show(terms[3])} ${plus(fourth)} = ${show(t(5))}`, `${tn(6)} = ${show(t(5))} ${plus(fourth + 2 * a)} = ${show(t(6))}`],
    hints: ['The first differences are not constant, but the second difference is.', `The second difference is ${2 * a}, so the next first differences are ${show(fourth)} and ${show(fourth + 2 * a)}.`, `Add them on one at a time to get ${tn(5)}, then ${tn(6)}.`],
  };
}

function quadraticRule(rng) {
  const { a, b, c, t } = quadraticPattern(rng);
  const k = int(rng, 4, 9);
  const rule = `${a === 1 ? '' : a}n²${b === 0 ? '' : ` ${b < 0 ? '−' : '+'} ${Math.abs(b) === 1 ? '' : Math.abs(b)}n`}${c === 0 ? '' : ` ${plus(c)}`}`;
  return {
    instruction: `${tn()} = ${rule} · find ${tn(k)}`,
    display: `${tn(k)} = ?`,
    answer: t(k),
    steps: [`${tn(k)} = ${a === 1 ? '' : a}(${k})²${b === 0 ? '' : ` ${plus(b)}(${k})`}${c === 0 ? '' : ` ${plus(c)}`}`, `= ${a * k * k}${b === 0 ? '' : ` ${plus(b * k)}`}${c === 0 ? '' : ` ${plus(c)}`}`, `= ${show(t(k))}`],
    hints: [`Put n = ${k} into the rule.`, `Square first: ${k}² = ${k * k}${a === 1 ? '' : `, then × ${a} = ${a * k * k}`}.`, 'Now add or subtract the other terms.'],
  };
}

export function patterns(grade, level, rng) {
  const plan = {
    7: [() => nextTerm(rng, 7), () => ruleTerm(rng, 10), () => sequenceTerm(rng, 7, 10)],
    8: [() => ruleTerm(rng, 20), () => sequenceTerm(rng, 8, 20), () => findN(rng, 8, false)],
    9: [() => sequenceTerm(rng, 9, int(rng, 15, 30)), () => findN(rng, 9, true), () => (rng() < 0.5 ? geometricNext(rng) : nextTerm(rng, 9))],
    10: [() => sequenceTerm(rng, 10, 50), () => findN(rng, 10, true), () => quadraticNext(rng, false)],
    11: [() => quadraticNext(rng, false), () => quadraticRule(rng), () => quadraticNext(rng, true)],
  };
  const q = plan[grade][level - 1]();
  return { ...q, answer: String(q.answer) };
}

// --- data handling --------------------------------------------------------------

function modeOrRange(rng) {
  if (rng() < 0.5) {
    let list = numbers(rng, 6, 3, 40);
    while (new Set(list).size < 4) list = numbers(rng, 6, 3, 40);
    const [low, high] = [Math.min(...list), Math.max(...list)];
    return {
      instruction: 'Find the range · show each step',
      display: `Range of ${list.join(', ')}`,
      answer: high - low,
      steps: [`biggest = ${high}, smallest = ${low}`, `${high} − ${low} = ${high - low}`],
      hints: ['Range = biggest value − smallest value.', `The biggest is ${high} and the smallest is ${low}.`, `Work out ${high} − ${low}.`],
    };
  }
  for (;;) {
    const list = numbers(rng, 7, 2, 12);
    const counts = {};
    list.forEach((n) => (counts[n] = (counts[n] ?? 0) + 1));
    const top = Math.max(...Object.values(counts));
    const modes = Object.keys(counts).filter((n) => counts[n] === top);
    if (top < 2 || modes.length > 1) continue;
    return {
      instruction: 'Find the mode · show each step',
      display: `Mode of ${list.join(', ')}`,
      answer: Number(modes[0]),
      steps: [`in order: ${sorted(list).join(', ')}`, `mode = ${modes[0]}`],
      hints: ['The mode is the value that appears most often.', `In order: ${sorted(list).join(', ')}.`, `One value appears ${top} times.`],
    };
  }
}

function median(rng, count) {
  for (;;) {
    const list = numbers(rng, count, 2, 40);
    const order = sorted(list);
    const mid = count / 2;
    const value = count % 2 ? order[Math.floor(mid)] : (order[mid - 1] + order[mid]) / 2;
    if (!Number.isInteger(value) || order.join() === list.join()) continue;
    return {
      instruction: 'Order the data · find the median',
      display: `Median of ${list.join(', ')}`,
      answer: value,
      steps: count % 2 ? [`${order.join(', ')}`, `median = ${value}`] : [`${order.join(', ')}`, `(${order[mid - 1]} + ${order[mid]}) ÷ 2`, `= ${value}`],
      hints: [
        'Write the values from smallest to biggest.',
        `In order: ${order.join(', ')}.`,
        count % 2 ? 'The median is the middle value.' : `There are two middle values, ${order[mid - 1]} and ${order[mid]}. Find the number halfway between them.`,
      ],
    };
  }
}

// A list of whole numbers whose mean is also a whole number.
function listWithMean(rng, count, min, max) {
  for (;;) {
    const list = numbers(rng, count - 1, min, max);
    const need = (count - (sum(list) % count)) % count;
    const last = min + ((need - (min % count) + count) % count) + count * int(rng, 0, Math.floor((max - min) / count) - 1);
    if (last >= min && last <= max) return shuffle(rng, [...list, last]);
  }
}

function mean(rng, count, max) {
  const list = listWithMean(rng, count, 2, max);
  const total = sum(list);
  return {
    instruction: 'Find the mean · show each step',
    display: `Mean of ${list.join(', ')}`,
    answer: total / count,
    steps: [`sum = ${total}`, `${total} ÷ ${count} = ${total / count}`],
    hints: ['Mean = sum of the values ÷ how many values there are.', `The sum is ${total} and there are ${count} values.`, `Work out ${total} ÷ ${count}.`],
  };
}

function missingValue(rng, count) {
  const list = listWithMean(rng, count, 3, 30);
  const m = sum(list) / count;
  const hidden = int(rng, 0, count - 1);
  const known = sum(list) - list[hidden];
  return {
    instruction: `The mean is ${m} · find x`,
    display: `Mean of ${list.map((n, i) => (i === hidden ? 'x' : n)).join(', ')} is ${m}`,
    answer: x(list[hidden]),
    steps: [`total = ${m} × ${count} = ${m * count}`, `known values add up to ${known}`, `x = ${m * count} − ${known}`, `x = ${list[hidden]}`],
    hints: ['If you know the mean, you can find the total: mean × number of values.', `The total must be ${m} × ${count} = ${m * count}.`, `The other values add up to ${known}. What is left for x?`],
  };
}

function probability(rng) {
  const [a, b] = [int(rng, 2, 9), int(rng, 2, 9)];
  const colours = shuffle(rng, ['red', 'blue', 'green', 'yellow']);
  return {
    instruction: `A bag has ${a} ${colours[0]} and ${b} ${colours[1]} balls. One is picked without looking`,
    display: `P(${colours[0]}) = ?`,
    answer: fraction(a, a + b),
    simplest: true,
    steps: [`total = ${a} + ${b} = ${a + b}`, `P(${colours[0]}) = ${a}/${a + b}`, ...(gcd(a, a + b) > 1 ? [`= ${fraction(a, a + b)}`] : [])],
    hints: ['Probability = number of ways it can happen ÷ total number of outcomes.', `There are ${a + b} balls and ${a} of them are ${colours[0]}.`, `Write ${a} over ${a + b}, then simplify if you can.`],
  };
}

// Quartiles by position: Q1 at (n + 1)/4 and Q3 at 3(n + 1)/4, for n = 7 or 11.
function quartileList(rng, count) {
  for (;;) {
    const list = numbers(rng, count, 2, 50);
    if (new Set(list).size < count) continue;
    const order = sorted(list);
    const q = (count + 1) / 4;
    return { list, order, q1: order[q - 1], q3: order[3 * q - 1], spot: q };
  }
}

function quartile(rng) {
  const { list, order, q1, q3, spot } = quartileList(rng, 7);
  const lower = rng() < 0.5;
  return {
    instruction: `Find the ${lower ? 'lower quartile (Q1)' : 'upper quartile (Q3)'}`,
    display: `${lower ? 'Q1' : 'Q3'} of ${list.join(', ')}`,
    answer: lower ? q1 : q3,
    steps: [`${order.join(', ')}`, `median = ${order[3]}`, `${lower ? 'Q1' : 'Q3'} = ${lower ? q1 : q3}`],
    hints: ['Order the data, then find the median. It splits the data into two halves.', `In order: ${order.join(', ')}. The median is ${order[3]}.`, `${lower ? 'Q1' : 'Q3'} is the middle of the ${lower ? 'lower' : 'upper'} half (value number ${lower ? spot : 3 * spot}).`],
  };
}

function interquartile(rng, count) {
  const { list, order, q1, q3 } = quartileList(rng, count);
  return {
    instruction: 'Find the interquartile range (Q3 − Q1)',
    display: `IQR of ${list.join(', ')}`,
    answer: q3 - q1,
    steps: [`${order.join(', ')}`, `Q1 = ${q1}, Q3 = ${q3}`, `IQR = ${q3} − ${q1}`, `= ${q3 - q1}`],
    hints: ['Order the data, then find the middle of the lower half (Q1) and of the upper half (Q3).', `In order: ${order.join(', ')}. Q1 = ${q1} and Q3 = ${q3}.`, `Work out ${q3} − ${q1}.`],
  };
}

function spread(rng, deviation) {
  // How far each value is from the mean; chosen so the variance is a whole
  // number (and a perfect square for the standard deviation)
  const shapes = deviation
    ? [[-2, -2, 2, 2], [-3, -3, 3, 3], [-3, -1, 0, 1, 3], [-6, -2, 0, 2, 6], [-1, -1, 1, 1], [-4, -4, 4, 4]]
    : [[-2, -1, 0, 1, 2], [-3, -1, 1, 3], [-4, -2, 0, 2, 4], [-4, -2, 2, 4], [-5, -1, 1, 5], [-3, -1, 0, 1, 3]];
  const shape = pick(rng, shapes);
  const m = int(rng, 7, 20);
  const list = shuffle(rng, shape.map((d) => m + d));
  const squares = list.map((v) => (v - m) ** 2);
  const variance = sum(squares) / list.length;
  return {
    instruction: deviation ? 'Find the standard deviation (σ)' : 'Find the variance (σ²)',
    display: `${deviation ? 'σ' : 'σ²'} of ${list.join(', ')}`,
    answer: deviation ? Math.sqrt(variance) : variance,
    steps: [`mean = ${m}`, `squared differences: ${squares.join(', ')}`, `variance = ${sum(squares)} ÷ ${list.length} = ${variance}`, ...(deviation ? [`σ = √${variance} = ${Math.sqrt(variance)}`] : [])],
    hints: [
      'First find the mean. Then find how far each value is from the mean, and square it.',
      `The mean is ${m}. The squared differences are ${squares.join(', ')}.`,
      deviation ? `The variance is ${sum(squares)} ÷ ${list.length} = ${variance}. The standard deviation is its square root.` : `Add them up and divide by ${list.length}.`,
    ],
  };
}

export function data(grade, level, rng) {
  const plan = {
    7: [() => modeOrRange(rng), () => median(rng, 5), () => mean(rng, 5, 20)],
    8: [() => median(rng, 6), () => mean(rng, 6, 30), () => missingValue(rng, 4)],
    9: [() => mean(rng, 6, 60), () => missingValue(rng, 5), () => probability(rng)],
    10: [() => mean(rng, 8, 60), () => quartile(rng), () => interquartile(rng, 7)],
    11: [() => interquartile(rng, 11), () => spread(rng, false), () => spread(rng, true)],
  };
  const q = plan[grade][level - 1]();
  return { ...q, answer: String(q.answer) };
}

const MAKERS = { algebra, geometry, fractions, arithmetic, patterns, data };

// Finish a senior sum: every way of writing the answer that should count.
export function makeSenior(topic, grade, level, rng) {
  const q = MAKERS[topic](grade, level, rng);
  const bare = q.answer.replace(/^[a-z]=/, '');
  return { ...q, accepted: [...new Set([q.answer, bare, `=${bare}`, ...(q.accepted ?? [])])] };
}

export const SENIOR_TOPICS = Object.keys(MAKERS);

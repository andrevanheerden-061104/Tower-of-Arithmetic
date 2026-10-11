import { close, evaluate, plainSubscripts, tidy } from './evaluate.js';

// ---------------------------------------------------------------------------
// Working out the answer to a question by code, without trusting the AI.
//
// solveQuestion({ instruction, display }) reads the question the way the
// game shows it and returns:
//   { value }  the one right answer, as a number
//   { test }   a function: is this number a right answer? (for equations
//              with more than one answer, like x² = 49)
//   null       this kind of question can't be worked out by code
//
// It understands:
//   sums and equations     "6 × 24 = ?"   "2x − 4 = 10"   "? + 6 = 13"
//   number patterns        "3, 7, 11, 15, ?"   "… T₁₀ = ?"   "… n = ?"
//   pattern rules          "Tₙ = 3n + 2 · find T₁₀"
//   data                   "Median of 4, 9, 2, 7, 5"   "Mean of 4, x, 9 is 6"
// ---------------------------------------------------------------------------

const minus = (text) => String(text).replace(/[−–—]/g, '-');
const sum = (list) => list.reduce((a, b) => a + b, 0);
const sorted = (list) => [...list].sort((a, b) => a - b);

// --- data ---------------------------------------------------------------------

function median(list) {
  const order = sorted(list);
  const mid = order.length / 2;
  return order.length % 2 ? order[Math.floor(mid)] : (order[mid - 1] + order[mid]) / 2;
}

// Quartiles as taught in CAPS: the median of the lower and upper halves
// (the middle value is left out when the count is odd).
function quartiles(list) {
  const order = sorted(list);
  const half = Math.floor(order.length / 2);
  return [median(order.slice(0, half)), median(order.slice(order.length - half))];
}

function mode(list) {
  const counts = new Map();
  list.forEach((n) => counts.set(n, (counts.get(n) ?? 0) + 1));
  const top = Math.max(...counts.values());
  const modes = [...counts.keys()].filter((n) => counts.get(n) === top);
  return top > 1 && modes.length === 1 ? modes[0] : null; // no clear mode: can't be marked
}

function variance(list) {
  const mean = sum(list) / list.length;
  return sum(list.map((v) => (v - mean) ** 2)) / list.length;
}

const STATISTICS = [
  [/standard deviation|(^|[^²\w])σ(?!²)/i, (list) => Math.sqrt(variance(list))],
  [/variance|σ²/i, variance],
  [/interquartile|\biqr\b/i, (list) => quartiles(list)[1] - quartiles(list)[0]],
  [/lower quartile|\bq1\b/i, (list) => quartiles(list)[0]],
  [/upper quartile|\bq3\b/i, (list) => quartiles(list)[1]],
  [/\b(mean|average)\b/i, (list) => sum(list) / list.length],
  [/\bmedian\b/i, median],
  [/\bmode\b/i, mode],
  [/\brange\b/i, (list) => Math.max(...list) - Math.min(...list)],
  [/\btotal\b/i, sum],
];

// The list of numbers in a data question: "Mean of 4, 7, x, 9 is 6" →
// { items: [4, 7, 'x', 9], target: 6 }
function dataList(display) {
  const text = minus(display);
  const match = text.match(/(-?\d+(?:\.\d+)?|x)(\s*[,;]\s*(-?\d+(?:\.\d+)?|x)){2,}/i);
  if (!match) return null;
  const items = match[0].split(/[,;]/).map((part) => (part.trim().toLowerCase() === 'x' ? 'x' : Number(part)));
  const after = text.slice(match.index + match[0].length).match(/\bis\s+(-?\d+(?:\.\d+)?)/i);
  return { items, target: after ? Number(after[1]) : null };
}

function solveData(instruction, display, topic) {
  // The word may be in the instruction instead ("Find the median"), but only
  // data questions are read that way: other topics have lists of numbers too
  const found = STATISTICS.find(([word]) => word.test(display)) ?? (topic === 'data' ? STATISTICS.find(([word]) => word.test(instruction)) : null);
  const list = dataList(display);
  if (!found || !list) return null;
  const unknown = list.items.filter((item) => item === 'x').length;
  if (unknown === 0) {
    const value = found[1](list.items);
    return value === null || !Number.isFinite(value) ? null : { value };
  }
  // One value is missing and the mean is given: x = mean × count − the rest
  if (unknown === 1 && /\b(mean|average)\b/i.test(`${display} ${instruction}`)) {
    const target = list.target ?? Number(minus(instruction).match(/\b(?:mean|average) is\s+(-?\d+(?:\.\d+)?)/i)?.[1]);
    if (!Number.isFinite(target)) return null;
    return { value: target * list.items.length - sum(list.items.filter((item) => item !== 'x')) };
  }
  return null;
}

// --- number patterns ------------------------------------------------------------

// What kind of pattern a list of numbers is, and a function for any term.
function patternOf(terms) {
  const diffs = terms.slice(1).map((t, i) => t - terms[i]);
  if (diffs.every((d) => close(d, diffs[0]))) {
    return { kind: 'linear', term: (k) => terms[0] + (k - 1) * diffs[0], first: terms[0], d: diffs[0] };
  }
  const ratios = terms.slice(1).map((t, i) => t / terms[i]);
  if (terms.every((t) => t !== 0) && ratios.every((r) => close(r, ratios[0]))) {
    return { kind: 'geometric', term: (k) => terms[0] * ratios[0] ** (k - 1) };
  }
  const second = diffs.slice(1).map((d, i) => d - diffs[i]);
  if (terms.length >= 4 && second.every((d) => close(d, second[0]))) {
    const a = second[0] / 2;
    const b = diffs[0] - 3 * a;
    const c = terms[0] - a - b;
    return { kind: 'quadratic', term: (k) => a * k * k + b * k + c };
  }
  return null;
}

function solvePattern(instruction, display) {
  const text = plainSubscripts(minus(display)).replace(/…|\.\.\./g, ',');
  const match = text.match(/^\s*(-?\d+(?:\.\d+)?(?:\s*,\s*-?\d+(?:\.\d+)?){2,})\s*,[\s,]*(.*)$/);
  if (!match) return null;
  const terms = match[1].split(',').map(Number);
  const pattern = patternOf(terms);
  const ask = match[2].replace(/\s+/g, '').toLowerCase();
  if (!pattern) return null;
  // "3, 7, 11, 15, ?" → the next term
  if (ask === '?' || ask === '?=') return { value: pattern.term(terms.length + 1) };
  // "… T10 = ?" → that term
  const which = ask.match(/^t_?(\d+)=\?$/);
  if (which) return { value: pattern.term(Number(which[1])) };
  // "… n = ?" with "Which term of the pattern is 66?" → its position
  if (ask === 'n=?' && pattern.kind === 'linear' && pattern.d !== 0) {
    const target = Number(minus(instruction).match(/\bis\s+(-?\d+(?:\.\d+)?)/i)?.[1]);
    const n = (target - pattern.first) / pattern.d + 1;
    return Number.isFinite(target) && Number.isInteger(Math.round(n * 1e6) / 1e6) && n > 0 ? { value: Math.round(n) } : null;
  }
  return null;
}

// "Tₙ = 3n + 2 · find T₁₀" with "T₁₀ = ?"
function solveRule(instruction, display) {
  const text = plainSubscripts(minus(`${instruction} · ${display}`));
  const rule = text.match(/\bTn\s*=\s*([-0-9n\s+*/×÷^().²³]+)/i);
  const which = text.match(/\bT_?(\d+)\s*=\s*\?/i) ?? text.match(/\bfind\s+T_?(\d+)/i);
  if (!rule || !which) return null;
  try {
    const value = evaluate(rule[1].trim().replace(/[.\s]+$/, ''), Number(which[1]));
    return Number.isFinite(value) ? { value } : null;
  } catch {
    return null;
  }
}

// --- sums and equations ---------------------------------------------------------

function solveEquation(instruction, display) {
  let text = tidy(display);
  const letters = (text.match(/[xn]/g) ?? []).length;
  const blanks = (text.match(/\?/g) ?? []).length;
  if (blanks && letters) {
    // "3x + 5 = ?" with "If x = 4": put the number in
    const given = minus(instruction).match(/\bx\s*=\s*(-?\d+(?:\.\d+)?)/i);
    const [left, right] = text.split('=');
    if (given && right === '?' && !left.includes('?')) {
      try {
        const value = evaluate(left, Number(given[1]));
        return Number.isFinite(value) ? { value } : null;
      } catch {
        return null;
      }
    }
    // "3 x 4 = ?" uses x as a times sign
    text = text.replace(/(?<=[\d)])x(?=[\d(])/g, '*');
    if (/[xn]/.test(text)) return null;
  }
  if (blanks > 1 || (!blanks && !letters)) return null;
  const sides = text.split('=');
  if (sides.length !== 2 || !sides[0] || !sides[1]) return null;

  let f;
  try {
    f = (v) => evaluate(sides[0], v) - evaluate(sides[1], v);
    f(1.5); // throws now if the text isn't maths
  } catch {
    return null;
  }

  // A straight-line equation has exactly one answer
  const [f0, f1, f2] = [f(0), f(1), f(2)];
  if ([f0, f1, f2].every(Number.isFinite) && close(f2 - f1, f1 - f0) && !close(f1, f0)) {
    return { value: -f0 / (f1 - f0) };
  }

  // Anything else (x² = 49, 12/x = 3, 2^x = 32): look for every answer
  // between −60 and 60, in steps of a twelfth
  const positiveOnly = /x\s*>\s*0|positive/i.test(instruction);
  const roots = [];
  for (let k = -720; k <= 720; k++) {
    const v = k / 12;
    const y = f(v);
    if (Number.isFinite(y) && Math.abs(y) < 1e-9 && (!positiveOnly || v > 0)) roots.push(v);
  }
  if (roots.length === 1) return { value: roots[0] };
  // More than one answer and the question doesn't say which: not fair to ask
  return null;
}

export function solveQuestion({ instruction = '', display = '', topic = '' }) {
  try {
    return solveData(instruction, display, topic) ?? solveRule(instruction, display) ?? solvePattern(instruction, display) ?? solveEquation(instruction, display);
  } catch {
    return null;
  }
}

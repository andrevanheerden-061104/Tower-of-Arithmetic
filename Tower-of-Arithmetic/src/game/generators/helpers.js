// Small helpers shared by the sum makers in this folder.
// `rng` is a function that gives a number from 0 to 1 (Math.random by default).

// Whole number from min to max (both included).
export const int = (rng, min, max) => min + Math.floor(rng() * (max - min + 1));

// One item from a list.
export const pick = (rng, list) => list[Math.floor(rng() * list.length)];

export function shuffle(rng, list) {
  const copy = [...list];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export const gcd = (a, b) => (b ? gcd(b, a % b) : Math.abs(a));

// A fraction in its simplest form, as text: 6/8 → "3/4", 8/4 → "2", −2/4 → "-1/2".
export function fraction(n, d) {
  if (d < 0) [n, d] = [-n, -d];
  const g = gcd(n, d) || 1;
  return d / g === 1 ? `${n / g}` : `${n / g}/${d / g}`;
}

// Numbers as shown in a sum, with a real minus sign: −5.
export const show = (n) => (n < 0 ? `−${-n}` : `${n}`);
// "+ 4" or "− 4", for the middle of a sum.
export const plus = (n) => (n < 0 ? `− ${-n}` : `+ ${n}`);
// A term with a letter: 1 → "x", −1 → "−x", 3 → "3x".
export const term = (k, letter = 'x') => (k === 1 ? letter : k === -1 ? `−${letter}` : `${show(k)}${letter}`);
// "3x + 2", "x − 5", "3x" (nothing added when c is 0).
export const linear = (k, c, letter = 'x') => (c === 0 ? term(k, letter) : `${term(k, letter)} ${plus(c)}`);

// Three answers to tap: the right one and two near misses, mixed up.
// `gaps` are how far off the wrong answers may be.
export function choices(rng, answer, gaps = [1, 2, 10]) {
  const wrong = new Set();
  const options = shuffle(
    rng,
    gaps.flatMap((g) => [answer + g, answer - g]).filter((n) => n >= 0 && n !== answer),
  );
  for (const n of options) {
    if (wrong.size < 2) wrong.add(n);
  }
  for (let n = answer + 1; wrong.size < 2; n++) wrong.add(n);
  return shuffle(rng, [answer, ...wrong]).map(String);
}

// Split a number into its place values: 368 → [300, 60, 8].
export function places(n) {
  const digits = String(n).split('');
  return digits.map((d, i) => Number(d) * 10 ** (digits.length - 1 - i)).filter(Boolean);
}

// A number with a given count of digits.
export const digits = (rng, count) => int(rng, count === 1 ? 2 : 10 ** (count - 1), 10 ** count - 1);

// A short list of whole numbers for a data question.
export const numbers = (rng, count, min, max) => Array.from({ length: count }, () => int(rng, min, max));

export const sorted = (list) => [...list].sort((a, b) => a - b);
export const sum = (list) => list.reduce((a, b) => a + b, 0);

// A small, safe calculator for checking the AI's answers (no eval()).
//
// Understands: numbers (12, 3.5), + − × ÷ * / ^, brackets, a minus sign in
// front (−3), "x", "n" or "?" as the unknown, ½ ¼ ¾ ⅓ ⅔, small raised
// powers (3², 2⁵), square roots (√16), per cent (25% of 80), mixed numbers
// (1 1/2), degrees (°, ignored), "of" (½ of 36) and multiplying without a
// sign (2x, 3(10), (2)(3), 2√9).

const FRACTIONS = { '½': '(1/2)', '¼': '(1/4)', '¾': '(3/4)', '⅓': '(1/3)', '⅔': '(2/3)' };
const SUPERSCRIPTS = '⁰¹²³⁴⁵⁶⁷⁸⁹';
const SUBSCRIPTS = '₀₁₂₃₄₅₆₇₈₉';

// Small lowered numbers become ordinary ones: T₁₀ → T10.
export function plainSubscripts(text) {
  return String(text).replace(/[₀-₉]/g, (c) => SUBSCRIPTS.indexOf(c)).replace(/ₙ/g, 'n');
}

export function tidy(text) {
  let s = String(text);
  for (const [k, v] of Object.entries(FRACTIONS)) s = s.split(k).join(v);
  return s
    .replace(/[−–—]/g, '-')
    // 3² → 3^(2), 2⁻³ → 2^(-3)
    .replace(/⁻?[⁰¹²³⁴-⁹]+/g, (run) => `^(${run.replace('⁻', '-').replace(/[⁰¹²³⁴-⁹]/g, (c) => SUPERSCRIPTS.indexOf(c))})`)
    // 1 1/2 → (1+1/2), then 12 500 → 12500
    .replace(/(\d+)\s+(\d+)\/(\d+)/g, '($1+$2/$3)')
    .replace(/(\d)\s(?=\d{3}(?!\d))/g, '$1')
    // 3/4 written as a fraction is one number: 3/4 ÷ 1/8 is (3/4) ÷ (1/8)
    .replace(/(?<![\d.])(\d+)\/(\d+)(?![\d.])/g, '($1/$2)')
    .replace(/[×·]/g, '*')
    .replace(/÷/g, '/')
    .replace(/°/g, '')
    .replace(/%/g, '/100')
    .replace(/\bof\b/gi, '*')
    .replace(/\s+/g, '')
    .toLowerCase();
}

function tokenize(s) {
  const tokens = [];
  let i = 0;
  while (i < s.length) {
    const c = s[i];
    if (/[0-9.]/.test(c)) {
      let j = i;
      while (j < s.length && /[0-9.]/.test(s[j])) j++;
      const n = Number(s.slice(i, j));
      if (Number.isNaN(n)) throw new Error(`Bad number "${s.slice(i, j)}"`);
      tokens.push({ t: 'num', v: n });
      i = j;
    } else if (c === 'x' || c === 'n' || c === '?') {
      tokens.push({ t: 'var' });
      i++;
    } else if ('+-*/^()√'.includes(c)) {
      tokens.push({ t: c });
      i++;
    } else {
      throw new Error(`Can't read "${c}"`);
    }
  }
  return tokens;
}

// Work out an expression with the unknown (x, n or ?) set to `value`.
export function evaluate(expression, value = NaN) {
  const tokens = tokenize(tidy(expression));
  let pos = 0;
  const peek = () => tokens[pos];
  const startsFactor = (tok) => tok && (tok.t === 'num' || tok.t === 'var' || tok.t === '(' || tok.t === '√');

  function sum() {
    let v = product();
    while (peek()?.t === '+' || peek()?.t === '-') {
      const op = tokens[pos++].t;
      const r = product();
      v = op === '+' ? v + r : v - r;
    }
    return v;
  }
  function product() {
    let v = signed();
    for (;;) {
      const tok = peek();
      if (tok?.t === '*' || tok?.t === '/') {
        pos++;
        const r = signed();
        v = tok.t === '*' ? v * r : v / r;
      } else if (startsFactor(tok)) {
        v *= power(); // 2x, 3(10)
      } else {
        return v;
      }
    }
  }
  // A minus in front applies to the whole power: −3² is −9, (−3)² is 9
  function signed() {
    if (peek()?.t === '-') {
      pos++;
      return -signed();
    }
    if (peek()?.t === '+') {
      pos++;
      return signed();
    }
    return power();
  }
  function power() {
    const base = single();
    if (peek()?.t === '^') {
      pos++;
      return base ** exponent();
    }
    return base;
  }
  // What a power is raised to may have its own minus: 2^-3
  function exponent() {
    if (peek()?.t === '-') {
      pos++;
      return -exponent();
    }
    return power();
  }
  function single() {
    const tok = tokens[pos++];
    if (!tok) throw new Error('Ended too soon');
    if (tok.t === 'num') return tok.v;
    if (tok.t === 'var') return value;
    if (tok.t === '√') return Math.sqrt(single());
    if (tok.t === '(') {
      const v = sum();
      if (peek()?.t !== ')') throw new Error('Missing )');
      pos++;
      return v;
    }
    throw new Error(`Unexpected "${tok.t}"`);
  }

  const result = sum();
  if (pos !== tokens.length) throw new Error('Extra symbols at the end');
  return result;
}

// The number an answer stands for: "x = 7" → 7, "7/8" → 0.875, "55°" → 55.
export function answerValue(answer) {
  const s = tidy(answer).replace(/^[a-z]\w*=/, '').replace(/^=/, '');
  return evaluate(s);
}

export const close = (a, b) => Math.abs(a - b) <= 1e-9 * Math.max(1, Math.abs(a), Math.abs(b));

// Is `equation` (like "2x − 4 = 10" or "6 × 24 = ?") true when the unknown
// is the answer? False if it can't be worked out.
export function checks(equation, answer) {
  try {
    const sides = tidy(equation).split('=');
    if (sides.length !== 2 || !sides[0] || !sides[1]) return false;
    const value = answerValue(answer);
    if (!Number.isFinite(value)) return false;
    const left = evaluate(sides[0], value);
    const right = evaluate(sides[1], value);
    return Number.isFinite(left) && Number.isFinite(right) && close(left, right);
  } catch {
    return false;
  }
}

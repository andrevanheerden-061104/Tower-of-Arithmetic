// A small, safe calculator for checking the AI's answers (no eval()).
//
// Understands: numbers (12, 3.5), + − × ÷ * / ^, brackets, a minus sign in
// front (−3), "x" or "?" as the unknown, ½ ¼ ¾ ⅓ ⅔, degrees (°, ignored),
// "of" (½ of 36) and multiplying without a sign (2x, 3(10), (2)(3)).

const FRACTIONS = { '½': '(1/2)', '¼': '(1/4)', '¾': '(3/4)', '⅓': '(1/3)', '⅔': '(2/3)' };

export function tidy(text) {
  let s = String(text);
  for (const [k, v] of Object.entries(FRACTIONS)) s = s.split(k).join(v);
  return s
    .replace(/[−–—]/g, '-')
    .replace(/[×·]/g, '*')
    .replace(/÷/g, '/')
    .replace(/°/g, '')
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
    } else if (c === 'x' || c === '?') {
      tokens.push({ t: 'var' });
      i++;
    } else if ('+-*/^()'.includes(c)) {
      tokens.push({ t: c });
      i++;
    } else {
      throw new Error(`Can't read "${c}"`);
    }
  }
  return tokens;
}

// Work out an expression with the unknown (x or ?) set to `value`.
export function evaluate(expression, value = NaN) {
  const tokens = tokenize(tidy(expression));
  let pos = 0;
  const peek = () => tokens[pos];
  const startsFactor = (tok) => tok && (tok.t === 'num' || tok.t === 'var' || tok.t === '(');

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
    let v = power();
    for (;;) {
      const tok = peek();
      if (tok?.t === '*' || tok?.t === '/') {
        pos++;
        const r = power();
        v = tok.t === '*' ? v * r : v / r;
      } else if (startsFactor(tok)) {
        v *= power(); // 2x, 3(10)
      } else {
        return v;
      }
    }
  }
  function power() {
    const base = signed();
    if (peek()?.t === '^') {
      pos++;
      return base ** power();
    }
    return base;
  }
  function signed() {
    if (peek()?.t === '-') {
      pos++;
      return -signed();
    }
    if (peek()?.t === '+') {
      pos++;
      return signed();
    }
    return single();
  }
  function single() {
    const tok = tokens[pos++];
    if (!tok) throw new Error('Ended too soon');
    if (tok.t === 'num') return tok.v;
    if (tok.t === 'var') return value;
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

const close = (a, b) => Math.abs(a - b) <= 1e-9 * Math.max(1, Math.abs(a), Math.abs(b));

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

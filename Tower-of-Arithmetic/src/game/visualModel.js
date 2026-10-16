// Dyscalculia mode: turns a question into a picture that helps the player
// "see" the maths (Figma 08a / 08b). Every function here only reads the
// question; it never changes it.
//
// visualModel(question) returns null (no picture fits) or
//   { tip, model }
// where tip is one friendly sentence and model is one of:
//   { kind: 'jumps', from, to, size, count, each, ticks }   number line with jumps
//   { kind: 'bar', parts: [{ label, value, unknown }], total } bar model
//   { kind: 'row', values, between, highlight }              a row of number chips
//   { kind: 'fractions', rows: [{ parts, shaded, label }] }   fraction bars
//   { kind: 'grid', rows, cols }                              rows of dots (times)

// Maths symbols the generators use, written as plain ASCII to parse.
function plain(text) {
  return String(text ?? '')
    .replace(/[−–]/g, '-')
    .replace(/×/g, '*')
    .replace(/÷/g, '/')
    .replace(/°/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

const whole = (n) => Number.isInteger(n);
const between = (n, lo, hi) => n >= lo && n <= hi;
const signed = (n) => (n > 0 ? `+${n}` : `−${Math.abs(n)}`);
const nice = (n) => String(n).replace('-', '−');

function numberList(text) {
  return plain(text)
    .split(',')
    .map((s) => s.trim())
    .filter((s) => /^-?\d+(\.\d+)?$/.test(s))
    .map(Number);
}

// --- number lines ------------------------------------------------------

// "a equal jumps reach T": a jumps of an unknown size, from 0 to T.
function equalJumps(count, target) {
  if (!whole(count) || !whole(target) || !between(count, 2, 12) || !between(target, 2, 400)) return null;
  if (target % count !== 0) return null;
  return {
    tip: `${count} equal jumps reach ${target}. How long is each jump?`,
    model: { kind: 'jumps', from: 0, to: target, count, size: target / count, each: '?' },
  };
}

// "How many jumps of size reach T?"
function jumpsOf(size, target) {
  if (!whole(size) || !whole(target) || size < 1 || target % size !== 0) return null;
  const count = target / size;
  if (!between(count, 2, 12)) return null;
  return {
    tip: `How many jumps of ${size} reach ${target}?`,
    model: { kind: 'jumps', from: 0, to: target, count, size, each: String(size) },
  };
}

// One jump from a to b of an unknown length.
function oneJump(from, to) {
  if (!whole(from) || !whole(to) || from === to || Math.max(from, to) > 100 || Math.min(from, to) < 0) return null;
  const forward = to > from;
  return {
    tip: forward ? `Start at ${from}. How far is the jump to ${to}?` : `Start at ${from}. How far back is ${to}?`,
    model: { kind: 'jumps', from: Math.min(from, to), to: Math.max(from, to), count: 1, size: Math.abs(to - from), each: '?', back: !forward },
  };
}

// --- per topic ------------------------------------------------------------

function algebra(q) {
  // Look at the equation as given, then at the first step of working,
  // for a simple "ax = T" shape.
  for (const source of [q.display, q.steps?.[0]]) {
    const s = plain(source);
    let m = s.match(/^(\d*)x = (-?\d+)$/);
    if (m) {
      const a = m[1] === '' ? 1 : Number(m[1]);
      const found = equalJumps(a, Number(m[2]));
      if (found) return found;
    }
    m = s.match(/^x = (-?\d+) \/ (\d+)$/); // x = 81 ÷ 9
    if (m) {
      const found = equalJumps(Number(m[2]), Number(m[1]));
      if (found) return found;
    }
    // 2x = 39 - 15  →  2 equal jumps reach 24
    m = s.match(/^(\d*)x = (-?\d+) ([+-]) (\d+)$/);
    if (m) {
      const a = m[1] === '' ? 1 : Number(m[1]);
      const total = m[3] === '+' ? Number(m[2]) + Number(m[4]) : Number(m[2]) - Number(m[4]);
      if (a === 1) {
        // x + 6 = 10 → x = 10 − 6: the jump from 6 to 10
        const found = m[3] === '-' ? oneJump(Number(m[4]), Number(m[2])) : null;
        if (found) return found;
        continue;
      }
      const found = equalJumps(a, total);
      if (found) return found;
    }
  }
  const s = plain(q.display);
  if (/²/.test(q.display ?? '')) {
    return { tip: 'Find two numbers that multiply to the last number and add to the middle number.' };
  }
  if (/\^/.test(s)) return { tip: 'Write both sides as the same base, then the powers must be equal.' };
  if (/ and /.test(s)) return { tip: 'Add the two equations: the y parts cancel out.' };
  if (/\(/.test(s)) return { tip: 'Multiply out the bracket first: the number outside times each part inside.' };
  if (/x.*=.*x/.test(s)) return { tip: 'Move all the x’s to one side and the plain numbers to the other.' };
  if (/x\//.test(s)) return { tip: 'Get x/n on its own, then multiply both sides by n.' };
  return { tip: 'Do the same thing to both sides, like a balance scale.' };
}

// "x + 48° = 180°" or "x + 49° + 31° = 180°": a bar that adds to the total.
const GEOMETRY_TIPS = [
  [/straight line/i, 'Angles on a straight line add up to 180°.'],
  [/parallel/i, 'With parallel lines, the Z-shape angles are equal and the C-shape angles add up to 180°.'],
  [/lines cross/i, 'Where two lines cross, the opposite angles are equal.'],
  [/exterior/i, 'The outside angle equals the two far inside angles added together.'],
  [/tangent/i, 'A radius meets a tangent at 90°.'],
  [/diameter/i, 'An angle standing on a diameter is always 90°.'],
  [/centre/i, 'Two radii are equal sides. The angle at the centre is double the angle at the edge.'],
  [/pythagoras/i, 'The longest side squared = the other two sides squared, added together.'],
  [/hexagon|pentagon|octagon|polygon|sides\)/i, 'The inside angles of a shape add up to (sides − 2) × 180°.'],
  [/isosceles/i, 'Two equal sides means two equal base angles.'],
  [/quadrilateral/i, 'Angles in a quadrilateral add up to 360°. Collect the x’s, then the numbers.'],
  [/triangle/i, 'Angles in a triangle add up to 180°. Collect the x’s, then the numbers.'],
  [/point|around/i, 'Angles around a point add up to 360°.'],
];

function geometryTip(q) {
  const found = GEOMETRY_TIPS.find(([pattern]) => pattern.test(q.instruction ?? ''));
  return found ? { tip: found[1] } : null;
}

function geometry(q) {
  return angleBar(q) ?? geometryTip(q);
}

function angleBar(q) {
  const s = plain(q.steps?.[0]);
  const m = s.match(/^(.+) = (\d+)$/);
  if (!m) return null;
  const terms = m[1].split(' + ').map((t) => t.trim());
  if (terms.length < 2 || terms.length > 5) return null;
  const parts = [];
  for (const t of terms) {
    if (/^\d+$/.test(t)) parts.push({ label: `${t}°`, value: Number(t) });
    else if (/^\d*x$/.test(t)) parts.push({ label: `${t}`, value: null, unknown: true });
    else return null;
  }
  if (!parts.some((p) => p.unknown)) return null;
  const total = Number(m[2]);
  const known = parts.filter((p) => !p.unknown).reduce((sum, p) => sum + p.value, 0);
  const unknowns = parts.filter((p) => p.unknown).length;
  const missing = Math.max(1, (total - known) / unknowns);
  for (const p of parts) if (p.unknown) p.value = missing; // only sets the block's width
  return {
    tip: /^Angles/.test(q.instruction ?? '') ? `${q.instruction.split('·')[0].trim()} add up to ${total}°.` : `These angles add up to ${total}°.`,
    model: { kind: 'bar', parts, total: `${total}°` },
  };
}

function fractionRow(text) {
  const m = plain(text).match(/^(\d+)\/(\d+)$/);
  if (!m) return null;
  const [shaded, parts] = [Number(m[1]), Number(m[2])];
  if (!between(parts, 2, 24) || shaded > parts) return null;
  return { parts, shaded, label: `${shaded}/${parts}` };
}

function fractions(q) {
  const s = plain(q.display).replace(/ = \?$/, '');
  // a/n + b/n  or  a/n - b/n with the same bottom number
  let m = s.match(/^(\d+\/\d+) ([+-]) (\d+\/\d+)$/);
  if (m) {
    const a = fractionRow(m[1]);
    const b = fractionRow(m[3]);
    if (a && b && a.parts === b.parts) {
      return {
        tip: m[2] === '+' ? `Same size parts: count them all. ${a.shaded} parts and ${b.shaded} more.` : `Same size parts: start with ${a.shaded}, take away ${b.shaded}.`,
        model: { kind: 'fractions', rows: [a, b] },
      };
    }
    if (a && b) return { tip: 'Make the bottom numbers the same first, then add or take away the tops.', model: { kind: 'fractions', rows: [a, b] } };
  }
  // 3/4 of 28
  m = s.match(/^(\d+)\/(\d+) of (\d+)$/);
  if (m) {
    const [top, bottom, of] = m.slice(1).map(Number);
    if (between(bottom, 2, 12) && top <= bottom) {
      return {
        tip: `Split ${of} into ${bottom} equal parts, then take ${top} of them.`,
        model: { kind: 'fractions', rows: [{ parts: bottom, shaded: top, label: `${top} of ${bottom} parts of ${of}` }] },
      };
    }
  }
  // 25% of 72
  m = s.match(/^(\d+)% of (\d+)$/);
  if (m) {
    const p = Number(m[1]);
    const g = gcd(p, 100);
    const parts = 100 / g;
    if (parts <= 20) {
      return {
        tip: `${p}% is ${p / g} out of every ${parts} equal parts.`,
        model: { kind: 'fractions', rows: [{ parts, shaded: p / g, label: `${p}% of ${m[2]}` }] },
      };
    }
  }
  if (/\./.test(s)) return { tip: 'Line up the decimal points, then work from right to left.' };
  if (/\*/.test(s)) return { tip: 'Times the tops, then times the bottoms.' };
  if (/x/.test(s)) return { tip: 'Get rid of the bottom numbers first by multiplying both sides.' };
  if (/\/ \d/.test(s)) return { tip: 'Dividing by a fraction: flip it over and times.' };
  if (/\//.test(s)) return { tip: 'Make the bottom numbers the same first, then add or take away the tops.' };
  return null;
}

function gcd(a, b) {
  return b === 0 ? a : gcd(b, a % b);
}

function times(q) {
  const s = plain(q.display);
  let m = s.match(/^(\d+) \* (\d+) = \?$/);
  if (m) {
    const [rows, cols] = [Number(m[1]), Number(m[2])];
    if (rows * cols <= 60 && rows <= 10 && cols <= 10) {
      return { tip: `${rows} rows of ${cols}. Count them, or skip count by ${cols}.`, model: { kind: 'grid', rows, cols } };
    }
    return { tip: `Split it up: ${rows} × ${cols} is easier in smaller pieces.` };
  }
  m = s.match(/^(\d+) \/ (\d+) = \?$/);
  if (m) return jumpsOf(Number(m[2]), Number(m[1])) ?? { tip: `How many groups of ${m[2]} fit into ${m[1]}?` };
  return null;
}

function adding(q) {
  const s = plain(q.display);
  let m = s.match(/^(\d+) \+ \? = (\d+)$/);
  if (m) return oneJump(Number(m[1]), Number(m[2]));
  m = s.match(/^(\d+) - \? = (\d+)$/);
  if (m) return oneJump(Number(m[1]), Number(m[2]));
  m = s.match(/^(\d+) ([+-]) (\d+) = \?$/);
  if (m) {
    const [a, b] = [Number(m[1]), Number(m[3])];
    const to = m[2] === '+' ? a + b : a - b;
    if (to < 0) return null;
    if (Math.max(a, to) > 100) return { tip: m[2] === '+' ? 'Add the ones first, then the tens, then the hundreds.' : 'Take away the ones first, then the tens, then the hundreds.' };
    return {
      tip: m[2] === '+' ? `Start at ${a} and jump ${b} forward.` : `Start at ${a} and jump ${b} back.`,
      model: { kind: 'jumps', from: Math.min(a, to), to: Math.max(a, to), count: 1, size: b, each: String(b), back: m[2] === '-', mark: a },
    };
  }
  return null;
}

function patterns(q) {
  const source = plain(q.display).split(/ … | \.\.\. /)[0].replace(/, \?$/, '');
  const values = numberList(source);
  if (values.length < 3) {
    if (/n/.test(q.display ?? '')) return { tip: 'Solve it like an equation: undo the + or − first, then divide.' };
    if (/T/.test(q.display ?? '')) return { tip: 'Put the term number in place of n, then work it out.' };
    if (/→/.test(q.display ?? '')) return { tip: 'Follow the rule one step at a time. Going backwards? Undo each step.' };
    return null;
  }
  const gaps = values.slice(1).map((v, i) => v - values[i]);
  const same = gaps.every((g) => g === gaps[0]);
  const chips = /\?$/.test(plain(q.display)) ? [...values, '?'] : values;
  return {
    tip: same ? `Each number jumps by ${signed(gaps[0])}.` : 'Look at the jumps between the numbers. How do the jumps change?',
    model: { kind: 'row', values: chips.map(nice), between: gaps.map(signed) },
  };
}

function data(q) {
  const raw = plain(q.display);
  const bag = q.instruction?.match(/(\d+) (\w+) and (\d+) (\w+) balls/);
  if (bag) {
    const [a, colourA, b, colourB] = [Number(bag[1]), bag[2], Number(bag[3]), bag[4]];
    return {
      tip: `There are ${a + b} balls in all. Chance = the ones you want out of all of them.`,
      model: { kind: 'bar', parts: [{ label: `${a} ${colourA}`, value: a }, { label: `${b} ${colourB}`, value: b }], total: `${a + b} balls` },
    };
  }
  const listText = raw.replace(/^[^0-9x-]*of /, '').replace(/ is -?\d+$/, '');
  const values = listText.split(',').map((s) => s.trim());
  const numbers = values.filter((v) => /^-?\d+$/.test(v)).map(Number);
  if (numbers.length < 3) return null;
  const sorted = [...numbers].sort((a, b) => a - b);
  const kind = (raw.match(/^(\w+|σ²|σ)/) ?? [])[1] ?? '';
  let tip = 'Put the numbers in order first.';
  let highlight = [];
  if (/Median/.test(kind)) {
    const mid = (sorted.length - 1) / 2;
    highlight = sorted.length % 2 ? [mid] : [mid - 0.5, mid + 0.5];
    tip = sorted.length % 2 ? 'In order, the median is the one in the middle.' : 'In order, the median is halfway between the two middle numbers.';
  } else if (/Mode/.test(kind)) tip = 'In order, the same numbers sit side by side. Which one is there most?';
  else if (/Range/.test(kind)) {
    highlight = [0, sorted.length - 1];
    tip = 'Biggest take away smallest: the two ends of the row.';
  } else if (/Total|Mean|σ/.test(kind)) tip = /Total/.test(kind) ? 'Add them up, a pair at a time.' : 'Add them all up, then share by how many numbers there are.';
  else if (/IQR|Q1|Q3/.test(kind)) tip = 'In order, split the row in half. The quartiles are the middles of each half.';
  if (values.includes('x')) {
    return { tip: 'Mean × how many numbers = the total. The total take away the others gives x.', model: { kind: 'row', values: values.map(nice), between: [] } };
  }
  return { tip, model: { kind: 'row', values: sorted.map(nice), between: [], highlight } };
}

function arithmetic(q) {
  const s = q.display ?? '';
  if (/\(/.test(s) && /[×÷+−-]/.test(s.replace(/\([^)]*\)/g, ''))) return { tip: 'Brackets first. Then powers and roots, then × and ÷, then + and −.' };
  if (/[²³⁴⁵⁶⁷⁸⁹^√]/.test(s)) return { tip: 'Work out the powers and roots first, then the rest.' };
  if (/[×÷]/.test(s) && /[+−]/.test(s.replace(/^−/, ''))) return { tip: '× and ÷ come before + and −.' };
  if (/−\d|\(−/.test(s)) return { tip: 'Same signs make a plus. Different signs make a minus.' };
  const m = plain(s).match(/^(\d+) - (\d+) = \?$/);
  if (m && Number(m[2]) > Number(m[1])) return { tip: 'Taking away a bigger number goes below zero.' };
  return { tip: 'Work it out one small step at a time.' };
}

function measurement(q) {
  const i = q.instruction ?? '';
  if (/perimeter/i.test(i)) return { tip: 'Walk all the way around: add every side.' };
  if (/area/i.test(i)) return { tip: 'Rows times columns: length × breadth.' };
  if (/volume/i.test(i)) return { tip: 'Length × breadth gives one layer. Times by the height.' };
  if (/convert/i.test(i)) return { tip: '1 cm = 10 mm, 1 m = 100 cm, 1 km = 1000 m.' };
  return null;
}

const BY_TOPIC = {
  adding,
  takingAway: adding,
  times,
  multiplication: times,
  division: times,
  fractions,
  measurement,
  patterns,
  data,
  algebra,
  geometry,
  arithmetic,
};

export function visualModel(question) {
  if (!question) return null;
  try {
    const found = BY_TOPIC[question.type]?.(question) ?? null;
    if (!found || (!found.tip && !found.model)) return null;
    return found;
  } catch {
    return null; // a picture is a bonus: never break the question over it
  }
}

// Splits a line of text into plain and number pieces, so numbers can be
// drawn in gold ("the given number is highlighted").
export function numberPieces(text) {
  const pieces = [];
  const pattern = /(\d+(?:[.,/]\d+)?°?%?)/g;
  let last = 0;
  for (const m of String(text ?? '').matchAll(pattern)) {
    if (m.index > last) pieces.push({ text: text.slice(last, m.index), number: false });
    pieces.push({ text: m[0], number: true });
    last = m.index + m[0].length;
  }
  if (last < String(text ?? '').length) pieces.push({ text: String(text).slice(last), number: false });
  return pieces;
}

// Extra space around the signs so each part of the sum stands apart.
export function spaced(text) {
  return String(text ?? '')
    .replace(/\s*([=+×÷])\s*/g, '  $1  ')
    .replace(/(\S)\s+([−-])\s+/g, '$1  $2  ')
    .replace(/\s{3,}/g, '  ')
    .trim();
}

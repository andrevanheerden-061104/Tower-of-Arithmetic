import { fraction, gcd, int, numbers, pick, places, sorted, sum } from './helpers';

// ---------------------------------------------------------------------------
// Sums for Grades 4 to 6 (CAPS Intermediate Phase). The player works it out
// and types the final answer: a whole number, a fraction (3/4) or, in
// Grade 6, a decimal (4.25).
//
// Each maker is called as maker(grade, level, rng) and returns
// { instruction, display, answer, parts, hints }. `parts` are the two or
// three lines of "Show me a picture" (the sum split into easier pieces).
// ---------------------------------------------------------------------------

const TYPE = 'Work it out, then type your answer';

// A number with `count` digits (not ending in 0, so it isn't too easy).
function number(rng, count) {
  const n = int(rng, 10 ** (count - 1) + 1, 10 ** count - 1);
  return n % 10 === 0 ? n + int(rng, 1, 9) : n;
}

// --- multiplying ------------------------------------------------------------

function multiply(a, b) {
  // Split the smaller number by place value when it has 2 digits,
  // otherwise split the bigger one into its first part and the rest.
  let parts;
  if (b >= 10) {
    const [tens, ones = 0] = places(b);
    parts = ones
      ? [`${a} × ${tens} = ${a * tens}`, `${a} × ${ones} = ${a * ones}`, `${a * tens} + ${a * ones} = ?`]
      : [`${a} × ${tens / 10} = ${(a * tens) / 10}`, `${(a * tens) / 10} × 10 = ?`];
  } else if (a >= 10) {
    const first = places(a)[0];
    const rest = a - first;
    parts = rest
      ? [`${b} × ${first} = ${b * first}`, `${b} × ${rest} = ${b * rest}`, `${b * first} + ${b * rest} = ?`]
      : [`${b} × ${first / 10} = ${(b * first) / 10}`, `${(b * first) / 10} × 10 = ?`];
  } else {
    parts = [`${a} groups of ${b}`, `Count in ${b}s, ${a} times`, `${a - 1} × ${b} = ${(a - 1) * b}, then + ${b}`];
  }
  return {
    instruction: TYPE,
    display: `${a} × ${b} = ?`,
    answer: `${a * b}`,
    parts,
    hints: [
      a < 10 && b < 10 ? `Think of ${a} groups of ${b}.` : 'Split the bigger number into parts that are easy to multiply.',
      parts[0].replace(' = ?', ''),
      parts.at(-1).includes('?') ? `Now work out ${parts.at(-1).replace(' = ?', '')}.` : parts.at(-1),
    ],
  };
}

export function multiplication(grade, level, rng) {
  const plan = {
    4: [() => multiply(int(rng, 3, 10), int(rng, 3, 10)), () => multiply(number(rng, 2), int(rng, 3, 9)), () => multiply(int(rng, 12, 39), int(rng, 11, 29))],
    5: [() => multiply(number(rng, 2), int(rng, 3, 9)), () => multiply(number(rng, 3), int(rng, 3, 9)), () => multiply(number(rng, 3), int(rng, 12, 49))],
    6: [() => multiply(number(rng, 3), int(rng, 4, 9)), () => multiply(number(rng, 3), int(rng, 21, 89)), () => multiply(number(rng, 4), int(rng, 12, 59))],
  };
  return plan[grade][level - 1]();
}

// --- dividing (no remainders) -------------------------------------------------

function divide(quotient, divisor) {
  const total = quotient * divisor;
  const big = places(quotient)[0];
  const rest = quotient - big;
  const parts =
    rest && quotient >= 10
      ? [`${divisor * big} ÷ ${divisor} = ${big}`, `${divisor * rest} ÷ ${divisor} = ${rest}`, `${big} + ${rest} = ?`]
      : [`${divisor} × ? = ${total}`, `Count in ${divisor}s until you reach ${total}`];
  return {
    instruction: TYPE,
    display: `${total} ÷ ${divisor} = ?`,
    answer: `${quotient}`,
    parts,
    hints: [
      `How many ${divisor}s fit into ${total}?`,
      rest && quotient >= 10 ? `Split ${total} into ${divisor * big} and ${divisor * rest}.` : `Use your ${divisor} times table.`,
      rest && quotient >= 10 ? `${divisor * big} ÷ ${divisor} = ${big}. Now add ${divisor * rest} ÷ ${divisor}.` : `${divisor} × ${quotient - 1} = ${divisor * (quotient - 1)}. One more ${divisor} gets you there.`,
    ],
  };
}

// A quotient so that quotient × divisor has `count` digits.
function quotientFor(rng, divisor, count) {
  const low = Math.ceil(10 ** (count - 1) / divisor);
  const high = Math.floor((10 ** count - 1) / divisor);
  return int(rng, Math.max(low, 2), high);
}

export function division(grade, level, rng) {
  const by = (divisorMin, divisorMax, count) => () => {
    const d = int(rng, divisorMin, divisorMax);
    return divide(quotientFor(rng, d, count), d);
  };
  const plan = {
    4: [() => divide(int(rng, 3, 10), int(rng, 3, 10)), by(3, 9, 2), by(3, 9, 3)],
    5: [by(3, 9, 2), by(3, 9, 3), by(11, 25, 3)],
    6: [by(4, 9, 3), by(12, 35, 3), by(12, 45, 4)],
  };
  return plan[grade][level - 1]();
}

// --- fractions, percentages and decimals --------------------------------------

function fractionOf(rng, unit, maxWhole) {
  const d = pick(rng, unit ? [2, 3, 4, 5, 10] : [3, 4, 5, 6, 8, 10]);
  const n = unit ? 1 : int(rng, 2, d - 1);
  const whole = d * int(rng, 2, Math.max(3, Math.floor(maxWhole / d)));
  const one = whole / d;
  return {
    instruction: TYPE,
    display: `${n}/${d} of ${whole} = ?`,
    answer: `${one * n}`,
    parts: unit ? [`Share ${whole} into ${d} equal groups`, `${whole} ÷ ${d} = ?`] : [`${whole} ÷ ${d} = ${one}`, `That is 1/${d} of ${whole}`, `${one} × ${n} = ?`],
    hints: [
      `The bottom number tells you to share ${whole} into ${d} equal groups.`,
      `${whole} ÷ ${d} = ${one}. That is one ${d === 2 ? 'half' : `of the ${d} groups`}.`,
      unit ? `One group is the answer: ${whole} ÷ ${d}.` : `You need ${n} of those groups: ${one} × ${n}.`,
    ],
  };
}

// a/d ± b/d, with an answer that is already in its simplest form.
function sameDenominator(rng) {
  for (;;) {
    const d = pick(rng, [5, 6, 7, 8, 9, 10, 12]);
    const a = int(rng, 1, d - 2);
    const b = int(rng, 1, d - 1);
    const add = rng() < 0.5;
    const top = add ? a + b : a - b;
    if (top <= 0 || top >= d || gcd(top, d) !== 1) continue;
    return {
      instruction: 'Work it out, then type your answer like 5/8',
      display: `${a}/${d} ${add ? '+' : '−'} ${b}/${d} = ?`,
      answer: `${top}/${d}`,
      parts: [`The bottom number stays ${d}`, `${a} ${add ? '+' : '−'} ${b} = ?`, `Answer: ?/${d}`],
      hints: [
        'The bottom numbers are the same, so the pieces are the same size.',
        `Only ${add ? 'add' : 'subtract'} the top numbers: ${a} ${add ? '+' : '−'} ${b}.`,
        `Keep ${d} at the bottom. The top is ${a} ${add ? '+' : '−'} ${b}.`,
      ],
    };
  }
}

// a/b ± c/(b×k): one denominator is a multiple of the other.
function relatedDenominators(rng) {
  for (;;) {
    const b = pick(rng, [2, 3, 4, 5]);
    const k = pick(rng, [2, 3]);
    const d = b * k;
    const a = int(rng, 1, b - 1);
    const c = int(rng, 1, d - 1);
    const add = rng() < 0.6;
    const top = add ? a * k + c : a * k - c;
    if (top <= 0 || top >= d || gcd(c, d) !== 1 || gcd(a, b) !== 1) continue;
    return {
      instruction: 'Type your answer in its simplest form, like 3/4',
      display: `${a}/${b} ${add ? '+' : '−'} ${c}/${d} = ?`,
      answer: fraction(top, d),
      simplest: true,
      parts: [`${a}/${b} = ${a * k}/${d}`, `${a * k}/${d} ${add ? '+' : '−'} ${c}/${d} = ?`],
      hints: [
        `The bottom numbers must match. Change ${a}/${b} into ${d}ths.`,
        `${a}/${b} is the same as ${a * k}/${d}.`,
        `Now work out ${a * k}/${d} ${add ? '+' : '−'} ${c}/${d}${gcd(top, d) > 1 ? ', then simplify' : ''}.`,
      ],
    };
  }
}

function percentOf(rng) {
  const p = pick(rng, [10, 20, 25, 50, 75]);
  const step = { 10: 10, 20: 5, 25: 4, 50: 2, 75: 4 }[p];
  const whole = step * int(rng, 2, 25);
  const fractionText = { 10: '1/10', 20: '1/5', 25: '1/4', 50: '1/2', 75: '3/4' }[p];
  return {
    instruction: TYPE,
    display: `${p}% of ${whole} = ?`,
    answer: `${(whole * p) / 100}`,
    parts: [`${p}% is the same as ${fractionText}`, `${fractionText} of ${whole} = ?`],
    hints: [`Per cent means "out of 100".`, `${p}% is the same as ${fractionText}.`, `Work out ${fractionText} of ${whole}.`],
  };
}

function decimals(rng) {
  const a = int(rng, 11, 95) / 10; // one decimal place
  const b = int(rng, 105, 895) / 100; // two decimal places
  const add = rng() < 0.5;
  const big = Math.max(a, b);
  const small = Math.min(a, b);
  const result = add ? a + b : big - small;
  const text = (n) => String(Math.round(n * 100) / 100);
  return {
    instruction: 'Line up the decimal points, then type your answer',
    display: add ? `${text(a)} + ${text(b)} = ?` : `${text(big)} − ${text(small)} = ?`,
    answer: text(result),
    parts: [`Write ${text(a)} as ${a.toFixed(2)}`, 'Line up the decimal points', add ? 'Add the hundredths, tenths, then units' : 'Subtract the hundredths, tenths, then units'],
    hints: [
      'Write both numbers with two decimal places so the points line up.',
      `${text(a)} is the same as ${a.toFixed(2)}.`,
      add ? `Add the whole numbers and the decimals: ${Math.floor(a)} + ${Math.floor(b)}, then the parts after the point.` : `Subtract column by column, starting from the right.`,
    ],
  };
}

export function fractions(grade, level, rng) {
  const plan = {
    4: [() => fractionOf(rng, true, 40), () => fractionOf(rng, false, 48), () => sameDenominator(rng)],
    5: [() => fractionOf(rng, false, 60), () => sameDenominator(rng), () => relatedDenominators(rng)],
    6: [() => relatedDenominators(rng), () => percentOf(rng), () => decimals(rng)],
  };
  return plan[grade][level - 1]();
}

// --- measurement --------------------------------------------------------------

// A rectangle drawn with its side lengths (see GeometryFigure).
export function rectangle(w, h, unit, labels = {}) {
  const scale = Math.min(64 / w, 46 / h);
  const width = Math.max(w * scale, 28);
  const height = Math.max(h * scale, 16);
  const x = 60 - width / 2;
  const y = 38 - height / 2;
  return {
    lines: [
      [x, y, x + width, y],
      [x + width, y, x + width, y + height],
      [x + width, y + height, x, y + height],
      [x, y + height, x, y],
    ],
    labels: [
      { x: 60, y: y + height + 9, t: labels.w ?? `${w} ${unit}` },
      { x: x - 4, y: 40, t: labels.h ?? `${h} ${unit}`, anchor: 'end' },
    ],
  };
}

function perimeter(rng, max) {
  const square = rng() < 0.3;
  const w = int(rng, 4, max);
  const h = square ? w : int(rng, 2, w - 1);
  const unit = pick(rng, ['cm', 'm']);
  return {
    instruction: `Find the perimeter of the ${square ? 'square' : 'rectangle'} (all the way around)`,
    display: `Perimeter = ? ${unit}`,
    answer: `${2 * (w + h)}`,
    figure: rectangle(w, h, unit),
    parts: square ? [`All 4 sides are ${w} ${unit}`, `4 × ${w} = ?`] : [`${w} + ${h} + ${w} + ${h}`, `${2 * w} + ${2 * h} = ?`],
    hints: [
      'Perimeter is the distance all the way around the shape.',
      square ? `A square has 4 equal sides of ${w} ${unit}.` : `There are two sides of ${w} ${unit} and two sides of ${h} ${unit}.`,
      square ? `Work out 4 × ${w}.` : `Add ${2 * w} and ${2 * h}.`,
    ],
  };
}

function area(rng, maxW, maxH) {
  const w = int(rng, 4, maxW);
  const h = int(rng, 2, Math.min(maxH, w));
  const unit = pick(rng, ['cm', 'm']);
  return {
    instruction: 'Find the area of the rectangle (length × breadth)',
    display: `Area = ? ${unit}²`,
    answer: `${w * h}`,
    figure: rectangle(w, h, unit),
    parts: [`Area = length × breadth`, `${w} × ${h} = ?`],
    hints: ['Area is how many squares cover the shape.', `There are ${h} rows with ${w} squares in each row.`, `Work out ${w} × ${h}.`],
  };
}

function convert(rng) {
  const [big, small, factor] = pick(rng, [
    ['m', 'cm', 100],
    ['km', 'm', 1000],
    ['kg', 'g', 1000],
    ['l', 'ml', 1000],
    ['cm', 'mm', 10],
  ]);
  const n = int(rng, 2, 12);
  return {
    instruction: `Convert ${big} to ${small}`,
    display: `${n} ${big} = ? ${small}`,
    answer: `${n * factor}`,
    parts: [`1 ${big} = ${factor} ${small}`, `${n} × ${factor} = ?`],
    hints: [`How many ${small} are in 1 ${big}?`, `1 ${big} = ${factor} ${small}.`, `Multiply ${n} by ${factor}.`],
  };
}

function volume(rng, max) {
  const l = int(rng, 3, max);
  const b = int(rng, 2, Math.min(l, 8));
  const h = int(rng, 2, 6);
  return {
    instruction: 'Find the volume of the box (length × breadth × height)',
    display: `${l} cm × ${b} cm × ${h} cm = ? cm³`,
    answer: `${l * b * h}`,
    parts: [`${l} × ${b} = ${l * b}`, `${l * b} × ${h} = ?`],
    hints: ['Volume is how many cubes fill the box.', `One layer has ${l} × ${b} = ${l * b} cubes.`, `There are ${h} layers: ${l * b} × ${h}.`],
  };
}

function missingSide(rng) {
  const w = int(rng, 6, 15);
  const h = int(rng, 3, w - 1);
  const unit = pick(rng, ['cm', 'm']);
  if (rng() < 0.5) {
    return {
      instruction: `The area is ${w * h} ${unit}². Find the missing side`,
      display: `? × ${w} = ${w * h}`,
      answer: `${h}`,
      figure: rectangle(w, h, unit, { h: `? ${unit}` }),
      parts: [`Area = length × breadth`, `${w * h} ÷ ${w} = ?`],
      hints: ['Area = length × breadth. One of them is missing.', `What times ${w} makes ${w * h}?`, `Work out ${w * h} ÷ ${w}.`],
    };
  }
  const p = 2 * (w + h);
  return {
    instruction: `The perimeter is ${p} ${unit}. Find the missing side`,
    display: `2 × ${w} + 2 × ? = ${p}`,
    answer: `${h}`,
    figure: rectangle(w, h, unit, { h: `? ${unit}` }),
    parts: [`${p} − ${2 * w} = ${p - 2 * w}`, `${p - 2 * w} ÷ 2 = ?`],
    hints: ['The two long sides and the two short sides make the perimeter.', `Take the two sides of ${w} away: ${p} − ${2 * w} = ${p - 2 * w}.`, `Share ${p - 2 * w} between the two missing sides.`],
  };
}

export function measurement(grade, level, rng) {
  const plan = {
    4: [() => perimeter(rng, 12), () => area(rng, 10, 6), () => convert(rng)],
    5: [() => perimeter(rng, 35), () => area(rng, 25, 9), () => volume(rng, 6)],
    6: [() => area(rng, 40, 12), () => volume(rng, 12), () => missingSide(rng)],
  };
  return plan[grade][level - 1]();
}

// --- number patterns ----------------------------------------------------------

function sequence(rng, start, step) {
  const terms = [0, 1, 2, 3].map((i) => start + i * step);
  const size = Math.abs(step);
  return {
    instruction: 'Find the rule, then type the next number',
    display: `${terms.join(', ')}, ?`,
    answer: `${start + 4 * step}`,
    parts: [`${terms[0]} → ${terms[1]} is ${step > 0 ? '+' : '−'}${size}`, `${terms[1]} → ${terms[2]} is ${step > 0 ? '+' : '−'}${size}`, `${terms[3]} ${step > 0 ? '+' : '−'} ${size} = ?`],
    hints: [
      'How much does each number change from the one before?',
      `The rule is "${step > 0 ? 'add' : 'subtract'} ${size}".`,
      `What is ${terms[3]} ${step > 0 ? '+' : '−'} ${size}?`,
    ],
  };
}

function ratio(rng, start, r) {
  const terms = [0, 1, 2, 3].map((i) => start * r ** i);
  return {
    instruction: 'Find the rule, then type the next number',
    display: `${terms.join(', ')}, ?`,
    answer: `${start * r ** 4}`,
    parts: [`${terms[0]} → ${terms[1]} is ×${r}`, `${terms[1]} → ${terms[2]} is ×${r}`, `${terms[3]} × ${r} = ?`],
    hints: ['The numbers grow faster each time. Try multiplying.', `The rule is "multiply by ${r}".`, `What is ${terms[3]} × ${r}?`],
  };
}

function flow(rng, backwards) {
  const m = int(rng, 2, 6);
  const c = int(rng, 1, 9);
  const input = int(rng, 3, 12);
  const add = rng() < 0.6 || input * m <= c;
  const output = add ? input * m + c : input * m - c;
  const rule = `× ${m} ${add ? '+' : '−'} ${c}`;
  if (!backwards) {
    return {
      instruction: `Flow diagram rule: ${rule}`,
      display: `Input ${input} → ?`,
      answer: `${output}`,
      parts: [`${input} × ${m} = ${input * m}`, `${input * m} ${add ? '+' : '−'} ${c} = ?`],
      hints: ['Do the rule one step at a time, from left to right.', `First multiply: ${input} × ${m} = ${input * m}.`, `Then ${add ? 'add' : 'subtract'} ${c}.`],
    };
  }
  return {
    instruction: `Flow diagram rule: ${rule}. Find the input`,
    display: `? → output ${output}`,
    answer: `${input}`,
    parts: [`Undo the last step: ${output} ${add ? '−' : '+'} ${c} = ${input * m}`, `${input * m} ÷ ${m} = ?`],
    hints: ['Work backwards: undo the steps in the opposite order.', `Undo "${add ? '+' : '−'} ${c}" first: ${output} ${add ? '−' : '+'} ${c} = ${input * m}.`, `Now undo "× ${m}": ${input * m} ÷ ${m}.`],
  };
}

// A pattern that goes up or down by `step` and never drops below zero.
function upOrDown(rng, start, step) {
  return rng() < 0.5 ? sequence(rng, start, step) : sequence(rng, start + step * 4, -step);
}

export function patterns(grade, level, rng) {
  const plan = {
    4: [
      () => sequence(rng, int(rng, 2, 30), int(rng, 2, 10)),
      () => {
        const step = int(rng, 2, 10);
        return sequence(rng, step * 4 + int(rng, 5, 40), -step);
      },
      () => ratio(rng, int(rng, 1, 5), 2),
    ],
    5: [
      () => upOrDown(rng, int(rng, 20, 200), int(rng, 6, 25)),
      () => ratio(rng, int(rng, 1, 5), pick(rng, [2, 3, 4])),
      () => flow(rng, false),
    ],
    6: [
      () => upOrDown(rng, int(rng, 100, 600), pick(rng, [15, 25, 35, 45, 75, 125])),
      () => (rng() < 0.5 ? ratio(rng, int(rng, 2, 6), pick(rng, [3, 4, 5])) : flow(rng, false)),
      () => flow(rng, true),
    ],
  };
  return plan[grade][level - 1]();
}

// --- data ---------------------------------------------------------------------

function listWithMode(rng, count, min, max) {
  for (;;) {
    const list = numbers(rng, count, min, max);
    const counts = {};
    list.forEach((n) => (counts[n] = (counts[n] ?? 0) + 1));
    const top = Math.max(...Object.values(counts));
    const modes = Object.keys(counts).filter((n) => counts[n] === top);
    if (top >= 2 && modes.length === 1) return { list, mode: Number(modes[0]), times: top };
  }
}

function mode(rng, count, min, max) {
  const { list, mode: m, times } = listWithMode(rng, count, min, max);
  return {
    instruction: 'Mode = the number that appears most often',
    display: `Mode of ${list.join(', ')}`,
    answer: `${m}`,
    parts: [`In order: ${sorted(list).join(', ')}`, 'Which number appears the most?'],
    hints: ['Put the numbers in order so the same ones sit together.', `In order: ${sorted(list).join(', ')}.`, `One number appears ${times} times.`],
  };
}

function range(rng, count, min, max) {
  let list = numbers(rng, count, min, max);
  while (new Set(list).size < 3) list = numbers(rng, count, min, max);
  const low = Math.min(...list);
  const high = Math.max(...list);
  return {
    instruction: 'Range = biggest − smallest',
    display: `Range of ${list.join(', ')}`,
    answer: `${high - low}`,
    parts: [`Biggest: ${high}`, `Smallest: ${low}`, `${high} − ${low} = ?`],
    hints: ['Find the biggest and the smallest number.', `The biggest is ${high} and the smallest is ${low}.`, `Work out ${high} − ${low}.`],
  };
}

function total(rng) {
  const list = numbers(rng, 4, 6, 25);
  return {
    instruction: 'Find the total of the data',
    display: `Total of ${list.join(', ')}`,
    answer: `${sum(list)}`,
    parts: [`${list[0]} + ${list[1]} = ${list[0] + list[1]}`, `${list[2]} + ${list[3]} = ${list[2] + list[3]}`, `${list[0] + list[1]} + ${list[2] + list[3]} = ?`],
    hints: ['Total means add all the numbers together.', `Add them in pairs: ${list[0]} + ${list[1]} and ${list[2]} + ${list[3]}.`, `Add ${list[0] + list[1]} and ${list[2] + list[3]}.`],
  };
}

function median(rng, count, min, max) {
  for (;;) {
    const list = numbers(rng, count, min, max);
    const order = sorted(list);
    const mid = count / 2;
    const value = count % 2 ? order[Math.floor(mid)] : (order[mid - 1] + order[mid]) / 2;
    if (!Number.isInteger(value) || order.join() === list.join()) continue;
    return {
      instruction: 'Median = the middle number when they are in order',
      display: `Median of ${list.join(', ')}`,
      answer: `${value}`,
      parts:
        count % 2
          ? [`In order: ${order.join(', ')}`, 'Which number is in the middle?']
          : [`In order: ${order.join(', ')}`, `Middle two: ${order[mid - 1]} and ${order[mid]}`, `(${order[mid - 1]} + ${order[mid]}) ÷ 2 = ?`],
      hints: [
        'First write the numbers from smallest to biggest.',
        `In order: ${order.join(', ')}.`,
        count % 2 ? 'Cross off one from each end until one number is left.' : `There are two middle numbers, ${order[mid - 1]} and ${order[mid]}. The median is halfway between them.`,
      ],
    };
  }
}

export function data(grade, level, rng) {
  const plan = {
    4: [() => mode(rng, 6, 2, 9), () => range(rng, 5, 3, 30), () => total(rng)],
    5: [() => mode(rng, 7, 5, 20), () => median(rng, 5, 2, 20), () => median(rng, 7, 5, 40)],
    6: [() => median(rng, 5, 10, 60), () => median(rng, 6, 4, 30), () => median(rng, 8, 10, 60)],
  };
  return plan[grade][level - 1]();
}

const MAKERS = { multiplication, division, fractions, measurement, patterns, data };

// Finish an intermediate sum: the parts become the "Show me a picture" lines.
export function makeIntermediate(topic, grade, level, rng) {
  const { parts, ...q } = MAKERS[topic](grade, level, rng);
  return { ...q, picture: { kind: 'breakdown', parts } };
}

export const INTERMEDIATE_TOPICS = Object.keys(MAKERS);

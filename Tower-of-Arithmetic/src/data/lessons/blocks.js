// Little helpers for writing lesson pages (see index.js for what each
// block looks like on screen).

// A big sum: "x + 3 = 7"
export const sum = (text) => ({ type: 'sum', text });

// Worked steps. Each row is [label, maths, note]. A row labelled "Answer"
// is gold and one labelled "Check" is green.
export const steps = (...rows) => ({ type: 'steps', rows: rows.map(([label, text, note]) => ({ label, text, note })) });

// Pairs of opposites or facts in small cards: ['+ ⇄ −', 'add undoes take away']
export const pairs = (...items) => ({ type: 'pairs', items });

// A highlighted rule card
export const rule = (text, title = 'THE GOLDEN RULE') => ({ type: 'rule', title, text });

// A short tip line under the steps
export const tip = (text) => ({ type: 'tip', text });

// A row of numbers with what happens between them:
// numbers([2, 4, 6, 8, '?'], ['+2', '+2', '+2', '+2'], 'Each one is 2 more')
export const numbers = (values, between = [], caption = null) => ({ type: 'numbers', values, between, caption });

// Dots to count, in the same style as the junior sums:
//   dots({ kind: 'dots', groups: [{ count: 3, color: 'gold' }, { count: 2, color: 'pink' }] }, '3 + 2 = 5')
export const dots = (picture, caption = null) => ({ type: 'dots', picture, caption });

// Orbs on each side of a sum, with a mystery box for x
export const orbs = (left, right, caption = null) => ({ type: 'orbs', left, right, caption });

// A balance scale: scale('x + 3', '7')
export const scale = (left, right) => ({ type: 'scale', left, right });

// Fraction bars: bars([8, 3, '3/8'], [8, 5, '5/8'])
export const bars = (...rows) => ({ type: 'bars', rows: rows.map(([parts, shaded, label]) => ({ parts, shaded, label })) });

// A drawing (geometry, rectangles): figure(drawing, caption)
export const figure = (drawing, caption = null) => ({ type: 'figure', figure: drawing, caption });

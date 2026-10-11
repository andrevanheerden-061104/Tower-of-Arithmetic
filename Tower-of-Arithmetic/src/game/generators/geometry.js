import { int, linear, pick } from './helpers';

// ---------------------------------------------------------------------------
// The geometry maker (Grades 7 to 11). It doesn't use the AI: each sum is
// built by an algorithm that picks the angles, works out the answer and
// DRAWS the shape to scale, so the picture always matches the numbers.
//
// A drawing ("figure") is a list of simple parts on a 120 × 80 canvas, drawn
// by src/components/run/GeometryFigure.js:
//   lines    [x1, y1, x2, y2]
//   arcs     { c: [x, y], r, a1, a2 }   an angle mark, from a1° to a2°
//   circles  [cx, cy, r]
//   labels   { x, y, t }                text
// Angles are in degrees, measured anticlockwise from "east", like in class.
// ---------------------------------------------------------------------------

const RAD = Math.PI / 180;
const W = 120;
const H = 80;

// The point `r` away from `c` in direction `deg`.
const at = (c, r, deg) => [c[0] + r * Math.cos(deg * RAD), c[1] - r * Math.sin(deg * RAD)];
// The direction from p to q, 0 to 360.
const direction = (p, q) => (Math.atan2(-(q[1] - p[1]), q[0] - p[0]) / RAD + 360) % 360;
const line = (p, q) => [p[0], p[1], q[0], q[1]];
const middle = (p, q) => [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2];
const degrees = (n) => `${n}°`;

function blank() {
  return { lines: [], arcs: [], circles: [], labels: [] };
}

// Mark the angle at `v` from direction a1 round to a2 (anticlockwise) and label it.
function sweep(fig, v, a1, a2, text, r = 9) {
  const size = (a2 - a1 + 360) % 360 || 360;
  fig.arcs.push({ c: v, r, a1, a2: a1 + size });
  const reach = r + (size < 40 ? 11 : 7) + (text.length > 4 ? 4 : 0);
  const [x, y] = at(v, reach, a1 + size / 2);
  fig.labels.push({ x, y: y + 2.5, t: text });
}

// Mark the inside angle at corner `v` between the arms to p and q.
function corner(fig, v, p, q, text, r = 9) {
  const a = direction(v, p);
  const b = direction(v, q);
  const size = (b - a + 360) % 360;
  if (size <= 180) sweep(fig, v, a, b, text, r);
  else sweep(fig, v, b, a, text, r);
}

// A small square for a right angle at `v` between the arms to p and q.
function square(fig, v, p, q, size = 5) {
  const a = at(v, size, direction(v, p));
  const b = at(v, size, direction(v, q));
  const far = [a[0] + b[0] - v[0], a[1] + b[1] - v[1]];
  fig.lines.push(line(a, far), line(far, b));
}

// A short tick across the middle of a side (shows equal sides).
function tick(fig, p, q) {
  const m = middle(p, q);
  const d = direction(p, q) + 90;
  fig.lines.push(line(at(m, 2.5, d), at(m, 2.5, d + 180)));
}

// A small arrow head on a line (shows parallel lines).
function arrow(fig, p, deg) {
  fig.lines.push(line(at(p, 4, deg + 150), p), line(at(p, 4, deg - 150), p));
}

// Move and scale points so they fill the canvas nicely.
function fit(points, box = { left: 14, right: 106, top: 12, bottom: 66 }) {
  const xs = points.map((p) => p[0]);
  const ys = points.map((p) => p[1]);
  const [minX, maxX, minY, maxY] = [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)];
  const scale = Math.min((box.right - box.left) / (maxX - minX || 1), (box.bottom - box.top) / (maxY - minY || 1));
  const dx = (box.left + box.right) / 2 - ((minX + maxX) / 2) * scale;
  const dy = (box.top + box.bottom) / 2 - ((minY + maxY) / 2) * scale;
  return points.map((p) => [p[0] * scale + dx, p[1] * scale + dy]);
}

// The corners of a triangle with angle A at the bottom left and B at the
// bottom right (to scale).
function trianglePoints(A, B) {
  const C = 180 - A - B;
  const side = Math.sin(B * RAD) / Math.sin(C * RAD); // length of the left side when the base is 1
  return fit([[0, 0], [1, 0], [side * Math.cos(A * RAD), -side * Math.sin(A * RAD)]]);
}

function drawTriangle(A, B, labels) {
  const fig = blank();
  const [P, Q, R] = trianglePoints(A, B);
  fig.lines.push(line(P, Q), line(Q, R), line(R, P));
  if (labels[0]) corner(fig, P, Q, R, labels[0]);
  if (labels[1]) corner(fig, Q, R, P, labels[1]);
  if (labels[2]) corner(fig, R, P, Q, labels[2]);
  return { fig, P, Q, R };
}

// Three whole-number angles that add up to `total`, each at least `min`.
function split(rng, total, parts, min) {
  for (;;) {
    const list = Array.from({ length: parts - 1 }, () => int(rng, min, total - min * (parts - 1)));
    const last = total - list.reduce((a, b) => a + b, 0);
    if (last >= min && last <= total - min * (parts - 1)) return [...list, last];
  }
}

const answer = (value) => ({ display: 'x = ?', answer: `x=${value}` });

// --- the shapes -----------------------------------------------------------------

// Angles on a straight line (two or three of them).
function straightLine(rng, three) {
  const fig = blank();
  const P = [60, 60];
  fig.lines.push([8, 60, 112, 60]);
  const parts = three ? split(rng, 180, 3, 30) : split(rng, 180, 2, 25);
  const hidden = int(rng, 0, parts.length - 1);
  let from = 0;
  parts.forEach((size, i) => {
    if (i < parts.length - 1) fig.lines.push(line(P, at(P, 44, from + size)));
    sweep(fig, P, from, from + size, i === hidden ? 'x' : degrees(size), 10);
    from += size;
  });
  const known = parts.filter((_, i) => i !== hidden);
  const total = known.reduce((a, b) => a + b, 0);
  return {
    instruction: 'Angles on a straight line · find x',
    ...answer(parts[hidden]),
    figure: fig,
    steps: [`x + ${known.map(degrees).join(' + ')} = 180°`, ...(three ? [`x + ${total}° = 180°`] : []), `x = 180° − ${total}°`, `x = ${parts[hidden]}°`],
    hints: ['Angles on a straight line add up to 180°.', `The angle${three ? 's' : ''} you know add${three ? '' : 's'} up to ${total}°.`, `Take ${total} away from 180.`],
  };
}

// Angles around a point.
function aroundPoint(rng) {
  const fig = blank();
  const P = [60, 40];
  const parts = split(rng, 360, rng() < 0.5 ? 3 : 4, 55);
  const hidden = int(rng, 0, parts.length - 1);
  let from = int(rng, 0, 80);
  parts.forEach((size, i) => {
    fig.lines.push(line(P, at(P, 30, from)));
    sweep(fig, P, from, from + size, i === hidden ? 'x' : degrees(size), 8);
    from += size;
  });
  const known = parts.filter((_, i) => i !== hidden);
  const total = known.reduce((a, b) => a + b, 0);
  return {
    instruction: 'Angles around a point · find x',
    ...answer(parts[hidden]),
    figure: fig,
    steps: [`x + ${known.map(degrees).join(' + ')} = 360°`, `x + ${total}° = 360°`, `x = ${parts[hidden]}°`],
    hints: ['Angles around a point make a full turn: 360°.', `The angles you know add up to ${total}°.`, `Take ${total} away from 360.`],
  };
}

// Two straight lines that cross.
function crossingLines(rng, opposite) {
  const fig = blank();
  const P = [60, 40];
  let a = int(rng, 35, 145);
  if (a > 80 && a < 100) a -= 25;
  fig.lines.push([10, 40, 110, 40], line(at(P, 36, a), at(P, 36, a + 180)));
  sweep(fig, P, 0, a, degrees(a), 9);
  if (opposite) sweep(fig, P, 180, 180 + a, 'x', 9);
  else sweep(fig, P, a, 180, 'x', 9);
  return opposite
    ? {
        instruction: 'Two straight lines cross · find x',
        ...answer(a),
        figure: fig,
        steps: [`x = ${a}°`, 'vertically opposite angles'],
        hints: ['Look at where x is compared with the angle you know.', 'They are opposite each other where the lines cross.', 'Vertically opposite angles are equal.'],
      }
    : {
        instruction: 'Two straight lines cross · find x',
        ...answer(180 - a),
        figure: fig,
        steps: [`x + ${a}° = 180°`, `x = 180° − ${a}°`, `x = ${180 - a}°`],
        hints: ['x and the angle you know sit next to each other on a straight line.', 'Angles on a straight line add up to 180°.', `Take ${a} away from 180.`],
      };
}

// The three angles of a triangle.
function triangle(rng) {
  const [A, B, C] = split(rng, 180, 3, 30);
  const hidden = int(rng, 0, 2);
  const angles = [A, B, C];
  const { fig } = drawTriangle(A, B, angles.map((size, i) => (i === hidden ? 'x' : degrees(size))));
  const known = angles.filter((_, i) => i !== hidden);
  return {
    instruction: 'Angles in a triangle · find x',
    ...answer(angles[hidden]),
    figure: fig,
    steps: [`x + ${known[0]}° + ${known[1]}° = 180°`, `x + ${known[0] + known[1]}° = 180°`, `x = ${angles[hidden]}°`],
    hints: ['The three angles of a triangle add up to 180°.', `Add the two angles you know: ${known[0]} + ${known[1]} = ${known[0] + known[1]}.`, `Take ${known[0] + known[1]} away from 180.`],
  };
}

// A triangle with two equal sides.
function isosceles(rng) {
  const base = int(rng, 35, 75);
  const top = 180 - 2 * base;
  const findBase = rng() < 0.5;
  const { fig, P, Q, R } = drawTriangle(base, base, findBase ? ['x', null, degrees(top)] : [degrees(base), null, 'x']);
  tick(fig, P, R);
  tick(fig, Q, R);
  return findBase
    ? {
        instruction: 'Isosceles triangle (two equal sides) · find x',
        ...answer(base),
        figure: fig,
        steps: [`x + x + ${top}° = 180°`, `2x = ${180 - top}°`, `x = ${base}°`],
        hints: ['The two sides with marks are equal, so the two angles opposite them are equal.', `Both base angles are x: x + x + ${top} = 180.`, `2x = ${180 - top}. Divide by 2.`],
      }
    : {
        instruction: 'Isosceles triangle (two equal sides) · find x',
        ...answer(top),
        figure: fig,
        steps: [`both base angles = ${base}°`, `x + ${base}° + ${base}° = 180°`, `x = ${top}°`],
        hints: ['The two sides with marks are equal, so the two angles opposite them are equal.', `The other base angle is also ${base}°.`, `Take ${2 * base} away from 180.`],
      };
}

// The outside angle of a triangle equals the two opposite inside angles.
function exteriorAngle(rng) {
  const [A, B, C] = split(rng, 180, 3, 35);
  const outside = A + C;
  const findOutside = rng() < 0.5;
  const { fig, Q, R } = drawTriangle(A, B, findOutside ? [degrees(A), null, degrees(C)] : [degrees(A), null, 'x']);
  const end = [Math.min(Q[0] + 16, W - 3), Q[1]];
  fig.lines.push(line(Q, end));
  sweep(fig, Q, 0, direction(Q, R), findOutside ? 'x' : degrees(outside), 7);
  return findOutside
    ? {
        instruction: 'Exterior angle of a triangle · find x',
        ...answer(outside),
        figure: fig,
        steps: [`x = ${A}° + ${C}°`, `x = ${outside}°`, 'exterior angle of a triangle'],
        hints: ['x is outside the triangle, on the straight line.', 'An exterior angle equals the two opposite interior angles added together.', `Add ${A} and ${C}.`],
      }
    : {
        instruction: 'Exterior angle of a triangle · find x',
        ...answer(C),
        figure: fig,
        steps: [`x + ${A}° = ${outside}°`, `x = ${outside}° − ${A}°`, `x = ${C}°`],
        hints: ['The outside angle equals the two opposite inside angles added together.', `So x + ${A} = ${outside}.`, `Take ${A} away from ${outside}.`],
      };
}

// Two parallel lines cut by a third line.
function parallelLines(rng) {
  const fig = blank();
  let t = int(rng, 50, 130);
  if (t > 80 && t < 100) t += 22;
  const shift = 17 / Math.tan(t * RAD);
  const U = [60 + shift, 24];
  const V = [60 - shift, 58];
  fig.lines.push([8, 24, 112, 24], [8, 58, 112, 58], line(at(U, 16, t), at(V, 16, t + 180)));
  arrow(fig, [100, 24], 0);
  arrow(fig, [100, 58], 0);
  const kind = pick(rng, ['corresponding', 'alternate', 'co-interior']);
  if (kind === 'corresponding') sweep(fig, U, 0, t, degrees(t), 8);
  if (kind === 'alternate') sweep(fig, U, 180, 180 + t, degrees(t), 8);
  if (kind === 'co-interior') sweep(fig, U, 180 + t, 360, degrees(180 - t), 8);
  sweep(fig, V, 0, t, 'x', 8);
  const given = kind === 'co-interior' ? 180 - t : t;
  return {
    instruction: 'Parallel lines (the arrows show them) · find x',
    ...answer(t),
    figure: fig,
    steps: kind === 'co-interior' ? [`x + ${given}° = 180°`, `x = ${t}°`, 'co-interior angles'] : [`x = ${t}°`, `${kind} angles`],
    hints: [
      'The two lines with arrows are parallel. Look at how x and the other angle sit on the line that cuts them.',
      kind === 'corresponding' ? 'They are in the same position at each crossing (an F shape).' : kind === 'alternate' ? 'They are between the lines on opposite sides (a Z shape).' : 'They are between the lines on the same side (a C shape).',
      kind === 'co-interior' ? `Co-interior angles add up to 180°: x = 180 − ${given}.` : `${kind[0].toUpperCase()}${kind.slice(1)} angles are equal.`,
    ],
  };
}

// The corners of a four-sided shape with the given angles (to scale), or
// null if they don't make a neat shape.
function quadPoints(A, B, D) {
  const P = [0, 0];
  const Q = [1, 0];
  const S = at(P, 0.7, A);
  const fromS = A + 180 + D; // direction of the top side
  const fromQ = 180 - B;
  // Where the ray from S meets the ray from Q
  const [dx1, dy1] = [Math.cos(fromS * RAD), -Math.sin(fromS * RAD)];
  const [dx2, dy2] = [Math.cos(fromQ * RAD), -Math.sin(fromQ * RAD)];
  const det = dx1 * -dy2 + dx2 * dy1;
  if (Math.abs(det) < 0.05) return null;
  const u = ((Q[0] - S[0]) * -dy2 + dx2 * (Q[1] - S[1])) / det;
  const w = (dx1 * (Q[1] - S[1]) - dy1 * (Q[0] - S[0])) / det;
  if (u < 0.45 || w < 0.45 || u > 2 || w > 2) return null;
  return fit([P, Q, [S[0] + u * dx1, S[1] + u * dy1], S]);
}

function quadFigure(rng, labelsFor) {
  for (;;) {
    const [A, B, C, D] = split(rng, 360, 4, 60);
    if (Math.max(A, B, C, D) > 130) continue;
    const points = quadPoints(A, B, D);
    if (!points) continue;
    const [P, Q, R, S] = points;
    const fig = blank();
    fig.lines.push(line(P, Q), line(Q, R), line(R, S), line(S, P));
    const labels = labelsFor([A, B, C, D]);
    corner(fig, P, Q, S, labels[0], 8);
    corner(fig, Q, R, P, labels[1], 8);
    corner(fig, R, S, Q, labels[2], 8);
    corner(fig, S, P, R, labels[3], 8);
    return { fig, angles: [A, B, C, D] };
  }
}

function quadrilateral(rng) {
  const hidden = int(rng, 0, 3);
  const { fig, angles } = quadFigure(rng, (list) => list.map((size, i) => (i === hidden ? 'x' : degrees(size))));
  const known = angles.filter((_, i) => i !== hidden);
  const total = known.reduce((a, b) => a + b, 0);
  return {
    instruction: 'Angles in a quadrilateral · find x',
    ...answer(angles[hidden]),
    figure: fig,
    steps: [`x + ${known.map(degrees).join(' + ')} = 360°`, `x + ${total}° = 360°`, `x = ${angles[hidden]}°`],
    hints: ['The four angles of a quadrilateral add up to 360°.', `The three angles you know add up to ${total}°.`, `Take ${total} away from 360.`],
  };
}

// Right-angled triangle: find a side with the theorem of Pythagoras.
function pythagoras(rng, findLeg, big) {
  const [a, b, c] = pick(rng, big ? [[5, 12, 13], [8, 15, 17], [7, 24, 25], [20, 21, 29], [12, 16, 20], [9, 40, 41]] : [[3, 4, 5], [6, 8, 10], [5, 12, 13], [9, 12, 15], [8, 15, 17]]);
  const fig = blank();
  const [P, Q, R] = fit([[0, 0], [Math.max(a, b), 0], [0, -Math.min(a, b)]], { left: 22, right: 100, top: 12, bottom: 62 });
  const [long, short] = [Math.max(a, b), Math.min(a, b)];
  fig.lines.push(line(P, Q), line(Q, R), line(R, P));
  square(fig, P, Q, R);
  const hide = findLeg ? 'short' : 'hyp';
  const m = middle(Q, R);
  fig.labels.push({ x: (P[0] + Q[0]) / 2, y: P[1] + 9, t: `${long}` });
  fig.labels.push({ x: P[0] - 5, y: (P[1] + R[1]) / 2 + 2.5, t: hide === 'short' ? 'x' : `${short}`, anchor: 'end' });
  fig.labels.push({ x: m[0] + 5, y: m[1] - 2, t: hide === 'hyp' ? 'x' : `${c}`, anchor: 'start' });
  return findLeg
    ? {
        instruction: 'Right-angled triangle · use Pythagoras to find x',
        ...answer(short),
        figure: fig,
        steps: [`x² + ${long}² = ${c}²`, `x² = ${c * c} − ${long * long}`, `x² = ${short * short}`, `x = ${short}`],
        hints: ['In a right-angled triangle: (short side)² + (short side)² = (longest side)².', `x² + ${long}² = ${c}², so x² = ${c * c} − ${long * long}.`, `x² = ${short * short}. Take the square root.`],
      }
    : {
        instruction: 'Right-angled triangle · use Pythagoras to find x',
        ...answer(c),
        figure: fig,
        steps: [`x² = ${long}² + ${short}²`, `x² = ${long * long} + ${short * short}`, `x² = ${c * c}`, `x = ${c}`],
        hints: ['x is the longest side (the hypotenuse), opposite the right angle.', `x² = ${long}² + ${short}² = ${long * long} + ${short * short}.`, `x² = ${c * c}. Take the square root.`],
      };
}

const POLYGONS = { 5: 'pentagon', 6: 'hexagon', 8: 'octagon', 9: 'nonagon', 10: 'decagon', 12: 'dodecagon' };

// A regular polygon: each interior angle, or the sum of them.
function polygon(rng) {
  const n = pick(rng, [5, 6, 8, 9, 10, 12]);
  const fig = blank();
  const centre = [60, 40];
  const points = Array.from({ length: n }, (_, i) => at(centre, 30, 90 + (360 / n) * i + 180 / n));
  points.forEach((p, i) => fig.lines.push(line(p, points[(i + 1) % n])));
  const each = ((n - 2) * 180) / n;
  const total = (n - 2) * 180;
  if (rng() < 0.5) {
    corner(fig, points[0], points[1], points[n - 1], 'x', 7);
    return {
      instruction: `Regular ${POLYGONS[n]} (${n} equal sides) · find each interior angle x`,
      ...answer(each),
      figure: fig,
      steps: [`sum = (${n} − 2) × 180°`, `sum = ${total}°`, `x = ${total}° ÷ ${n}`, `x = ${each}°`],
      hints: [`First find the sum of the interior angles: (n − 2) × 180°, with n = ${n}.`, `The sum is ${n - 2} × 180° = ${total}°.`, `All ${n} angles are equal: ${total} ÷ ${n}.`],
    };
  }
  return {
    instruction: `${POLYGONS[n][0].toUpperCase()}${POLYGONS[n].slice(1)} (${n} sides) · find the sum x of its interior angles`,
    ...answer(total),
    figure: fig,
    steps: [`x = (${n} − 2) × 180°`, `x = ${n - 2} × 180°`, `x = ${total}°`],
    hints: ['A polygon can be cut into triangles from one corner.', `With ${n} sides you get ${n - 2} triangles: (n − 2) × 180°.`, `Work out ${n - 2} × 180.`],
  };
}

// A parallelogram: opposite angles are equal, neighbours add up to 180°.
function parallelogram(rng) {
  let A = int(rng, 50, 130);
  if (A > 82 && A < 98) A += 20;
  const [P, Q, R, S] = fit([[0, 0], [1.5, 0], [1.5 + Math.cos(A * RAD), -Math.sin(A * RAD)], [Math.cos(A * RAD), -Math.sin(A * RAD)]]);
  const fig = blank();
  fig.lines.push(line(P, Q), line(Q, R), line(R, S), line(S, P));
  arrow(fig, middle(P, Q), 0);
  arrow(fig, middle(S, R), 0);
  const opposite = rng() < 0.5;
  corner(fig, P, Q, S, degrees(A), 8);
  if (opposite) corner(fig, R, S, Q, 'x', 8);
  else corner(fig, Q, R, P, 'x', 8);
  return opposite
    ? {
        instruction: 'Parallelogram · find x',
        ...answer(A),
        figure: fig,
        steps: [`x = ${A}°`, 'opposite angles of a parallelogram'],
        hints: ['x is in the corner opposite the angle you know.', 'In a parallelogram, opposite angles are equal.', `So x is the same as ${A}°.`],
      }
    : {
        instruction: 'Parallelogram · find x',
        ...answer(180 - A),
        figure: fig,
        steps: [`x + ${A}° = 180°`, `x = 180° − ${A}°`, `x = ${180 - A}°`],
        hints: ['x is next to the angle you know, between two parallel sides.', 'Co-interior angles between parallel lines add up to 180°.', `Take ${A} away from 180.`],
      };
}

// Angles written with x (like 2x + 10°) in a triangle or quadrilateral.
function withAlgebra(rng, sides) {
  for (;;) {
    const v = int(rng, 10, 40);
    const total = sides === 3 ? 180 : 360;
    const coefficients = Array.from({ length: sides }, () => int(rng, 1, 3));
    const constants = Array.from({ length: sides - 1 }, () => pick(rng, [0, 0, 10, 20, -10, 5, 15, 30]));
    const sizes = coefficients.map((k, i) => k * v + (constants[i] ?? 0));
    const last = total - sizes.slice(0, -1).reduce((a, b) => a + b, 0);
    constants.push(last - coefficients[sides - 1] * v);
    sizes[sides - 1] = last;
    const smallest = sides === 3 ? 42 : 60;
    if (sizes.some((s) => s < smallest || s > (sides === 3 ? 95 : 125)) || Math.abs(constants[sides - 1]) > 60) continue;
    const labels = coefficients.map((k, i) => `${linear(k, constants[i])}${constants[i] === 0 ? '' : '°'}`);
    let fig;
    if (sides === 3) fig = drawTriangle(sizes[0], sizes[1], labels).fig;
    else {
      const points = quadPoints(sizes[0], sizes[1], sizes[3]);
      if (!points) continue;
      const [P, Q, R, S] = points;
      fig = blank();
      fig.lines.push(line(P, Q), line(Q, R), line(R, S), line(S, P));
      corner(fig, P, Q, S, labels[0], 7);
      corner(fig, Q, R, P, labels[1], 7);
      corner(fig, R, S, Q, labels[2], 7);
      corner(fig, S, P, R, labels[3], 7);
    }
    const kSum = coefficients.reduce((a, b) => a + b, 0);
    const cSum = constants.reduce((a, b) => a + b, 0);
    return {
      instruction: `Angles in a ${sides === 3 ? 'triangle' : 'quadrilateral'} · solve for x`,
      ...answer(v),
      figure: fig,
      steps: [`${labels.join(' + ')} = ${total}°`, `${linear(kSum, cSum)} = ${total}`, `${kSum}x = ${total - cSum}`, `x = ${v}`],
      hints: [`The angles of a ${sides === 3 ? 'triangle add up to 180°' : 'quadrilateral add up to 360°'}. Write that as an equation.`, `Collect like terms: ${linear(kSum, cSum)} = ${total}.`, `${kSum}x = ${total - cSum}. Divide by ${kSum}.`],
    };
  }
}

// --- circle geometry (Grade 11) ---------------------------------------------------

const CENTRE = [60, 40];
const RADIUS = 30;
const dot = (fig, p, name, away) => {
  fig.circles.push([p[0], p[1], 0.9]);
  if (name) {
    const [x, y] = at(p, 6, away);
    fig.labels.push({ x, y: y + 2.5, t: name, quiet: true });
  }
};

// The angle at the centre is twice the angle at the circumference.
function centreAngle(rng) {
  const half = int(rng, 25, 65);
  const fig = blank();
  fig.circles.push([...CENTRE, RADIUS]);
  const A = at(CENTRE, RADIUS, 270 - half);
  const B = at(CENTRE, RADIUS, 270 + half);
  const C = at(CENTRE, RADIUS, int(rng, 70, 110));
  fig.lines.push(line(CENTRE, A), line(CENTRE, B), line(C, A), line(C, B));
  dot(fig, CENTRE, 'O', 180);
  const findCentre = rng() < 0.5;
  corner(fig, CENTRE, A, B, findCentre ? 'x' : degrees(2 * half), 6);
  corner(fig, C, A, B, findCentre ? degrees(half) : 'x', 9);
  return findCentre
    ? {
        instruction: 'O is the centre of the circle · find x',
        ...answer(2 * half),
        figure: fig,
        steps: [`x = 2 × ${half}°`, `x = ${2 * half}°`, 'angle at centre = 2 × angle at circumference'],
        hints: ['Both angles stand on the same arc: one at the centre, one on the circle.', 'The angle at the centre is twice the angle at the circumference.', `Work out 2 × ${half}.`],
      }
    : {
        instruction: 'O is the centre of the circle · find x',
        ...answer(half),
        figure: fig,
        steps: [`2x = ${2 * half}°`, `x = ${half}°`, 'angle at centre = 2 × angle at circumference'],
        hints: ['Both angles stand on the same arc: one at the centre, one on the circle.', 'The angle at the centre is twice the angle at the circumference.', `Work out ${2 * half} ÷ 2.`],
      };
}

// Opposite angles of a cyclic quadrilateral add up to 180°.
function cyclicQuad(rng) {
  for (;;) {
    const arcs = split(rng, 180, 4, 25).map((a) => a * 2); // even arcs that add up to 360
    const start = int(rng, 0, 60);
    const spots = [0, 1, 2, 3].map((i) => start + arcs.slice(0, i).reduce((a, b) => a + b, 0));
    const points = spots.map((s) => at(CENTRE, RADIUS, s));
    // The angle at a corner is half the arc opposite it
    const angles = [0, 1, 2, 3].map((i) => (arcs[(i + 1) % 4] + arcs[(i + 2) % 4]) / 2);
    const known = int(rng, 0, 3);
    const wanted = (known + 2) % 4;
    if (angles[known] === 90) continue;
    const fig = blank();
    fig.circles.push([...CENTRE, RADIUS]);
    points.forEach((p, i) => fig.lines.push(line(p, points[(i + 1) % 4])));
    [known, wanted].forEach((i) => corner(fig, points[i], points[(i + 1) % 4], points[(i + 3) % 4], i === known ? degrees(angles[i]) : 'x', 7));
    return {
      instruction: 'All four corners are on the circle · find x',
      ...answer(angles[wanted]),
      figure: fig,
      steps: [`x + ${angles[known]}° = 180°`, `x = ${angles[wanted]}°`, 'opposite angles of a cyclic quadrilateral'],
      hints: ['A four-sided shape with every corner on a circle is a cyclic quadrilateral.', 'Its opposite angles add up to 180°.', `Take ${angles[known]} away from 180.`],
    };
  }
}

// The angle in a semicircle is 90°.
function semicircle(rng) {
  const arc = int(rng, 20, 70) * 2;
  const fig = blank();
  fig.circles.push([...CENTRE, RADIUS]);
  const A = at(CENTRE, RADIUS, 180);
  const B = at(CENTRE, RADIUS, 0);
  const C = at(CENTRE, RADIUS, arc);
  fig.lines.push(line(A, B), line(A, C), line(B, C));
  dot(fig, CENTRE, 'O', 270);
  const atA = arc / 2;
  corner(fig, A, B, C, degrees(atA), 10);
  corner(fig, B, C, A, 'x', 9);
  return {
    instruction: 'The base is a diameter (O is the centre) · find x',
    ...answer(90 - atA),
    figure: fig,
    steps: ['angle at the circle = 90°', `x + ${atA}° + 90° = 180°`, `x = ${90 - atA}°`],
    hints: ['One side of the triangle is a diameter. What do you know about the angle at the top?', 'The angle in a semicircle is 90°.', `x + ${atA} + 90 = 180.`],
  };
}

// A tangent meets the radius at 90°.
function tangent(rng) {
  const a = int(rng, 38, 60);
  const r = 24;
  const O = [30, 53];
  const T = [O[0], O[1] - r];
  const P = [T[0] + r * Math.tan(a * RAD), T[1]];
  const fig = blank();
  fig.circles.push([...O, r]);
  fig.lines.push(line(O, T), line([T[0] - 12, T[1]], [Math.min(P[0] + 8, W - 2), T[1]]), line(O, P));
  dot(fig, O, 'O', 215);
  square(fig, T, O, P, 4);
  corner(fig, O, P, T, degrees(a), 8);
  corner(fig, P, T, O, 'x', 11);
  return {
    instruction: 'The line touches the circle (a tangent). O is the centre · find x',
    ...answer(90 - a),
    figure: fig,
    steps: ['radius ⊥ tangent, so that angle = 90°', `x + ${a}° + 90° = 180°`, `x = ${90 - a}°`],
    hints: ['Where a tangent touches a circle, it meets the radius at a special angle.', 'The radius and the tangent make 90°.', `x + ${a} + 90 = 180.`],
  };
}

// Two radii make an isosceles triangle.
function radiiTriangle(rng) {
  const top = int(rng, 25, 70) * 2;
  const fig = blank();
  fig.circles.push([...CENTRE, RADIUS]);
  const A = at(CENTRE, RADIUS, 270 - top / 2);
  const B = at(CENTRE, RADIUS, 270 + top / 2);
  fig.lines.push(line(CENTRE, A), line(CENTRE, B), line(A, B));
  dot(fig, CENTRE, 'O', 90);
  corner(fig, CENTRE, A, B, degrees(top), 6);
  corner(fig, A, B, CENTRE, 'x', 8);
  return {
    instruction: 'O is the centre of the circle · find x',
    ...answer((180 - top) / 2),
    figure: fig,
    steps: ['radii are equal, so the base angles are equal', `2x + ${top}° = 180°`, `2x = ${180 - top}°`, `x = ${(180 - top) / 2}°`],
    hints: ['Two sides of this triangle are radii. What does that tell you about the triangle?', 'It is isosceles, so both base angles are x.', `2x + ${top} = 180.`],
  };
}

// --- which shapes each grade gets -------------------------------------------------

export function geometry(grade, level, rng) {
  const either = (...makers) => pick(rng, makers)();
  const plan = {
    7: [() => straightLine(rng, false), () => triangle(rng), () => either(() => aroundPoint(rng), () => straightLine(rng, true), () => crossingLines(rng, false))],
    8: [() => either(() => triangle(rng), () => crossingLines(rng, true)), () => either(() => isosceles(rng), () => exteriorAngle(rng)), () => either(() => parallelLines(rng), () => pythagoras(rng, false, false))],
    9: [() => parallelLines(rng), () => either(() => quadrilateral(rng), () => exteriorAngle(rng), () => pythagoras(rng, true, false)), () => either(() => polygon(rng), () => withAlgebra(rng, 3))],
    10: [() => either(() => parallelogram(rng), () => isosceles(rng)), () => either(() => withAlgebra(rng, 3), () => polygon(rng)), () => either(() => withAlgebra(rng, 4), () => pythagoras(rng, true, true))],
    11: [() => either(() => centreAngle(rng), () => radiiTriangle(rng)), () => either(() => cyclicQuad(rng), () => semicircle(rng)), () => either(() => tangent(rng), () => centreAngle(rng))],
  };
  return plan[grade][level - 1]();
}

export const CANVAS = { width: W, height: H };

import { createRandom, pickOne, pickWeighted, randomInt } from './random';

// ---------------------------------------------------------------------------
// Dungeon map generator
//
// Builds a new branching map for every run, in the style of Slay the Spire:
//
//              [ BOSS ]            <- one boss, always the top floor
//            /    |    \
//          o      o      o         <- floor before the boss: always rest
//          |    /   \    |
//          o   o     o   o         <- rooms picked by the rules below
//           \  |     |  /
//            [ START ]             <- one start: the tower gate
//
// How it works
//   1. The map is a grid: one row per floor, COLUMNS spots across.
//   2. Several paths climb from the bottom row to the top row. Each step a
//      path moves up-left, straight up or up-right. Paths never cross each
//      other, and where two paths meet they share a room, which is what
//      makes the branches and choices.
//   3. Every bottom-row room joins to the single start, and every top-row
//      room joins to the single boss, so every route goes start -> boss.
//   4. Each room is given a type using the placement rules (see RULES).
//
// Everything random comes from the run's seed, so the same seed always gives
// the same map, and a new seed gives a different layout, routes and rooms.
// ---------------------------------------------------------------------------

export const COLUMNS = 4; // rooms side by side (fits a phone screen)

// How often each room type is picked when the rules allow it.
const WEIGHTS = {
  combat: 36,
  puzzle: 31,
  mystery: 18,
  shop: 10,
  rest: 4,
};

// Room placement rules. "row" counts from 0 (the first floor).
export const RULES = {
  firstRowType: 'combat',      // floor 1 is always a fight, to warm up
  beforeBossType: 'rest',      // the floor before the boss is always a rest
  minRow: {
    puzzle: 1,                 // not on floor 1
    shop: 2,                   // no shop until floor 3 (nothing to spend yet)
    rest: 3,                   // no rest in the first 3 floors
    mystery: 1,
  },
  // A room of these types can't lead straight into another of the same type
  // (no two rests, shops or mysteries in a row on any route).
  noRepeat: ['rest', 'shop', 'mystery', 'puzzle'],
  // When two rooms share a parent they are the player's choice, so try to
  // make them different. Already-used types get their weight multiplied by this.
  siblingPenalty: 0.15,
  // Every map with at least this many floors gets at least one of each.
  guaranteed: ['puzzle', 'mystery', 'shop'],
};

const key = (row, col) => `${row}-${col}`;

export function generateMap({ floors, seed, roomTypes }) {
  const random = createRandom(seed);
  const rows = floors - 1; // the last floor is the boss
  const pathCount = floors <= 5 ? 3 : 4;
  const allowed = roomTypes ?? Object.keys(WEIGHTS);

  const nodes = {};
  const edges = new Set(); // "row:fromCol>toCol"

  function addNode(row, col) {
    const id = key(row, col);
    if (!nodes[id]) {
      nodes[id] = {
        id,
        row,
        col,
        floor: row + 1,
        type: null,
        next: [],
        prev: [],
        // Small random nudge so the map looks hand drawn, not like a grid
        nudgeX: randomInt(random, -9, 9),
        nudgeY: randomInt(random, -6, 6),
      };
    }
    return nodes[id];
  }

  function link(from, to) {
    if (!from.next.includes(to.id)) from.next.push(to.id);
    if (!to.prev.includes(from.id)) to.prev.push(from.id);
  }

  // --- 1. Walk the paths ------------------------------------------------
  const firstCol = randomInt(random, 0, COLUMNS - 1);
  for (let p = 0; p < pathCount; p++) {
    // The first two paths start in different spots so there is always a choice
    let col = p === 0 ? firstCol : randomInt(random, 0, COLUMNS - 1);
    if (p === 1 && col === firstCol) col = (firstCol + randomInt(random, 1, COLUMNS - 1)) % COLUMNS;

    let current = addNode(0, col);
    for (let row = 0; row < rows - 1; row++) {
      const options = [col - 1, col, col + 1].filter((c) => {
        if (c < 0 || c >= COLUMNS) return false;
        // Moving diagonally must not cross a line that goes the other way
        if (c === col + 1 && edges.has(`${row}:${col + 1}>${col}`)) return false;
        if (c === col - 1 && edges.has(`${row}:${col - 1}>${col}`)) return false;
        return true;
      });
      const nextCol = pickOne(random, options);
      edges.add(`${row}:${col}>${nextCol}`);
      const next = addNode(row + 1, nextCol);
      link(current, next);
      current = next;
      col = nextCol;
    }
  }

  // --- 2. One start, one boss ------------------------------------------
  const start = { id: 'start', row: -1, col: (COLUMNS - 1) / 2, floor: 0, type: 'start', next: [], prev: [], nudgeX: 0, nudgeY: 0 };
  const boss = { id: 'boss', row: rows, col: (COLUMNS - 1) / 2, floor: floors, type: 'boss', next: [], prev: [], nudgeX: 0, nudgeY: 0 };
  nodes.start = start;
  nodes.boss = boss;

  const inRow = (row) =>
    Object.values(nodes)
      .filter((n) => n.row === row && n.id !== 'start' && n.id !== 'boss')
      .sort((a, b) => a.col - b.col);

  inRow(0).forEach((n) => link(start, n));
  inRow(rows - 1).forEach((n) => link(n, boss));

  // --- 3. Give every room a type ---------------------------------------
  for (let row = 0; row < rows; row++) {
    for (const node of inRow(row)) {
      node.type = chooseType(node, row, rows, nodes, allowed, random);
    }
  }
  guaranteeTypes(nodes, rows, allowed, floors, random);

  return {
    seed,
    floors,
    rows,
    columns: COLUMNS,
    nodes,
    startId: 'start',
    bossId: 'boss',
  };
}

function chooseType(node, row, rows, nodes, allowed, random) {
  if (row === 0) return RULES.firstRowType;
  if (row === rows - 1 && allowed.includes(RULES.beforeBossType)) return RULES.beforeBossType;

  const parents = node.prev.map((id) => nodes[id]);
  const siblingTypes = parents
    .flatMap((p) => p.next)
    .filter((id) => id !== node.id)
    .map((id) => nodes[id].type)
    .filter(Boolean);

  const weights = {};
  for (const [type, weight] of Object.entries(WEIGHTS)) {
    if (!allowed.includes(type)) continue;
    if (row < (RULES.minRow[type] ?? 0)) continue;
    // The floor before "rest before boss" can't be a rest, or there'd be two in a row
    if (type === RULES.beforeBossType && row === rows - 2) continue;
    if (RULES.noRepeat.includes(type) && parents.some((p) => p.type === type)) continue;
    weights[type] = siblingTypes.includes(type) ? weight * RULES.siblingPenalty : weight;
  }
  return pickWeighted(random, weights) ?? 'combat';
}

// Make sure the map has at least one puzzle, mystery and shop (where the
// version allows them), swapping a fight that breaks no rules.
function guaranteeTypes(nodes, rows, allowed, floors, random) {
  const rooms = Object.values(nodes).filter((n) => n.row >= 0 && n.row < rows);
  for (const type of RULES.guaranteed) {
    if (!allowed.includes(type)) continue;
    if (type === 'shop' && floors < 6) continue; // short maps can skip the shop
    if (rooms.some((n) => n.type === type)) continue;

    const candidates = rooms.filter(
      (n) =>
        n.type === 'combat' &&
        n.row >= (RULES.minRow[type] ?? 1) &&
        n.row < rows - 1 &&
        ![...n.prev, ...n.next].some((id) => nodes[id].type === type),
    );
    if (candidates.length) pickOne(random, candidates).type = type;
  }
}

// Rooms the player can walk into next. At the start of a run that's the
// first floor; after that it's the rooms joined to the one they're in.
export function reachableRooms(map, currentId) {
  const current = map.nodes[currentId ?? map.startId];
  return current.next;
}

// Check that a map follows the rules (used by the tests; handy when tweaking).
export function checkMap(map) {
  const problems = [];
  const all = Object.values(map.nodes);
  const bosses = all.filter((n) => n.type === 'boss');
  if (bosses.length !== 1) problems.push(`expected 1 boss, found ${bosses.length}`);

  // every room reachable from the start, and the boss reachable from every room
  const seen = new Set();
  const stack = [map.startId];
  while (stack.length) {
    const id = stack.pop();
    if (seen.has(id)) continue;
    seen.add(id);
    stack.push(...map.nodes[id].next);
  }
  if (seen.size !== all.length) problems.push('some rooms cannot be reached from the start');
  for (const n of all) {
    if (n.id !== map.bossId && n.next.length === 0) problems.push(`${n.id} is a dead end`);
  }
  for (const n of all) {
    if (n.type === 'rest' && n.row < RULES.minRow.rest) problems.push(`rest too early at ${n.id}`);
    if (n.row === 0 && n.type !== RULES.firstRowType) problems.push(`floor 1 room ${n.id} is ${n.type}`);
    for (const id of n.next) {
      const child = map.nodes[id];
      if (RULES.noRepeat.includes(n.type) && child.type === n.type) problems.push(`two ${n.type} rooms in a row at ${n.id}`);
    }
  }
  return problems;
}

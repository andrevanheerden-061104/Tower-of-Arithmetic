import { clampLevel, makeQuestion } from './generators';

// ---------------------------------------------------------------------------
// The sums asked in a run.
//
// Every sum belongs to the run's maths topic (the dungeon type the player
// chose), is made for the player's own grade, and has a difficulty level:
//   casting a spell   the spell card's level (1, 2 or 3)
//   a puzzle room     the floor: floors 1-3 level 1, 4-6 level 2, 7+ level 3
//
// Where a sum comes from:
//   1. the run's AI pool, if the server has sent one (run.questionPool)
//   2. otherwise the game's own sum maker (src/game/generators), which
//      always works, even with no internet
//
// A sum has these fields (the screens only read these):
//   type          the maths topic, e.g. 'algebra'
//   level         1, 2 or 3
//   instruction   short line above the sum
//   display       the sum as shown to the player
//   story         optional word problem shown above the sum (puzzles)
//   figure        optional drawing (geometry, rectangles)
//   answer        the correct answer (as text)
//   accepted      other ways of writing the answer that also count (senior)
//   simplest      true = a fraction answer must be in its simplest form
//   choices       three answers to tap (junior)
//   picture       optional visual help (dots, groups or a worked breakdown)
//   steps         example working (senior)
//   hints         three hints from Orrin, from a nudge to almost the answer
// ---------------------------------------------------------------------------

// Which maths topic a room on this floor uses. A focused dungeon always
// uses its own topic; a mixed dungeon works through the topics floor by floor.
export function typeForFloor(version, dungeonTypeId, floor) {
  const ids = version.dungeonTypes.map((t) => t.id);
  if (ids.includes(dungeonTypeId)) return dungeonTypeId;
  return ids[(Math.max(1, floor) - 1) % ids.length];
}

// The maths topic a cast asks. Junior spells each cast their own kind of
// sum in a mixed dungeon (Flashflame adds, Flash Freeze takes away, Shadow
// Shard times).
export function topicFor(version, dungeonTypeId, floor, spell) {
  if (version.id === 'junior' && dungeonTypeId === 'mixed' && spell?.juniorOp) return spell.juniorOp;
  return typeForFloor(version, dungeonTypeId, floor);
}

// How hard a puzzle room is, from its floor.
export function levelForFloor(floor) {
  if (floor <= 3) return 1;
  if (floor <= 6) return 2;
  return 3;
}

// The next unused AI sum for a topic and level, or null. Word problems
// (`story`) are kept for the puzzle rooms; fights use the plain sums.
function fromPool(run, topic, level, story) {
  const list = (run.questionPool?.[topic]?.[level] ?? []).filter((q) => Boolean(q.story) === story);
  const poolKey = `${topic}:${level}:${story ? 'story' : 'sum'}`;
  const used = run.questionsUsed?.[poolKey] ?? 0;
  return used < list.length ? { ...list[used], type: topic, level, source: 'ai', poolKey } : null;
}

// The game's own sum (always available, even offline). It tries a few
// times not to ask the very same sum twice in a row.
export function getQuestion(run, version, topic, level) {
  let question = makeQuestion({ versionId: version.id, grade: run.grade, topic, level });
  for (let tries = 0; tries < 4 && question.display === run.lastAsked; tries++) {
    question = makeQuestion({ versionId: version.id, grade: run.grade, topic, level });
  }
  return question;
}

// The sum for casting a spell: the run's topic at the spell card's level.
export function pickQuestion(run, version, floor, spell) {
  const topic = topicFor(version, run.dungeonTypeId, floor, spell);
  const level = clampLevel(spell?.level ?? 1);
  return fromPool(run, topic, level, false) ?? getQuestion(run, version, topic, level);
}

// The sum on a puzzle room's door: the run's topic at the floor's level.
// An AI word problem if there is one, otherwise a sum.
export function pickPuzzleQuestion(run, version, floor) {
  const topic = typeForFloor(version, run.dungeonTypeId, floor);
  const level = levelForFloor(floor);
  return fromPool(run, topic, level, true) ?? fromPool(run, topic, level, false) ?? getQuestion(run, version, topic, level);
}

// Every topic a run can ask: one for a focused dungeon, all for mixed.
export function topicsForRun(version, dungeonTypeId) {
  const ids = version.dungeonTypes.map((t) => t.id);
  return ids.includes(dungeonTypeId) ? [dungeonTypeId] : ids;
}

// Label for the maths a junior card will cast (shown on the card's tag).
export function juniorOpLabel(version, dungeonTypeId, spell) {
  const type = dungeonTypeId === 'mixed' ? spell.juniorOp : dungeonTypeId;
  return version.dungeonTypes.find((t) => t.id === type);
}

// --- checking an answer -------------------------------------------------------

// Tidy up typed working so "X = 7", "x=7" and "x =7 " all match. South
// African decimals may be typed with a comma (2,5).
export function normalise(text) {
  return String(text)
    .toLowerCase()
    .replace(/\s+/g, '')
    .replace(/[−–]/g, '-')
    .replace(/°/g, '')
    .replace(/(\d),(\d)/g, '$1.$2');
}

// The number a piece of text stands for ("7", "-3", "2.5", "7/8"), or null.
function toNumber(text) {
  const m = text.match(/^(-?\d+(?:\.\d+)?)(?:\/(\d+(?:\.\d+)?))?$/);
  if (!m) return null;
  const value = m[2] === undefined ? Number(m[1]) : Number(m[1]) / Number(m[2]);
  return Number.isFinite(value) ? value : null;
}

function isSimplest(text) {
  const m = text.match(/^-?(\d+)\/(\d+)$/);
  if (!m) return true;
  const gcd = (a, b) => (b ? gcd(b, a % b) : a);
  return gcd(Number(m[1]), Number(m[2])) === 1;
}

// Is the player's answer right? The last line of working is checked: what
// comes after its last "=" must be the answer ("2x = 14" is not "x = 7").
// Numbers are compared by value, so 0.5 and 0,50 both count.
export function isCorrect(question, input) {
  const given = normalise(input);
  if (!given) return false;
  const accepted = [question.answer, ...(question.accepted ?? [])].map(normalise);
  if (accepted.includes(given)) return true;

  const want = toNumber(normalise(question.answer).split('=').at(-1));
  const typed = given.split('=').at(-1);
  const got = toNumber(typed);
  if (want === null || got === null || Math.abs(want - got) > 1e-9) return false;
  // "2x = 14" is not the answer 14: the left of the "=" must be the letter on its own
  const left = given.split('=').at(-2) ?? '';
  if (/[a-z]/.test(left) && !/^[a-z]$/.test(left)) return false;
  return question.simplest ? isSimplest(typed) : true;
}

import { AppError } from '../lib/errors.js';
import { answerValue, close } from '../maths/evaluate.js';
import { solveQuestion } from '../maths/solve.js';
import { examplesOf, gradeFor, GUIDE } from './curriculum.js';
import { onTopic, topicsFor, VERSIONS } from './topics.js';

// ---------------------------------------------------------------------------
// AI maths questions
//
// One request makes a batch of sums for a run, so fights never wait for the
// network. The AI is told exactly what the player's GRADE covers in each
// topic at each of the three difficulty levels (curriculum.js).
//
// Nothing the AI writes is trusted. Before a sum reaches a child, code:
//   1. works out the answer itself with its own calculator (maths/solve.js)
//      and throws the sum away if the AI's answer is different, or if the
//      sum can't be worked out by code at all
//   2. checks the sum belongs to the topic that was asked for
//   3. checks the answer can be typed on the game's keypad (a whole number,
//      a simple fraction, or a decimal only where the grade uses decimals)
//   4. throws away copies of the examples and repeats
//
// The sums use the same fields as the game's own sum maker
// (Tower-of-Arithmetic/src/game/questions.js), grouped by topic and level:
//   { algebra: { 1: [q, q], 2: [q], 3: [q] } }
// ---------------------------------------------------------------------------

const MAX_TOTAL = 24;
const LEVELS = [1, 2, 3];

// How many sums to ask for at each level. A one-topic dungeon needs more of
// each; level 1 is used most (the starting spell, the first floors).
function countsFor(topicCount) {
  if (topicCount === 1) return { 1: 6, 2: 5, 3: 4 };
  if (topicCount <= 4) return { 1: 2, 2: 2, 3: 1 };
  return { 1: 2, 2: 1, 3: 1 };
}

const FORMAT = {
  tap: `- "answer": a whole number as text ("12"). The player taps one of three answers.
- "choices": exactly 3 different whole numbers as text: the answer and two close wrong answers (common mistakes).`,
  type: `- "answer": what the player types: a whole number ("144"), a fraction in simplest form ("5/8"), or a decimal ONLY when the level is about decimals ("4.25"). Never negative, no units.
- "breakdown": 2 or 3 short lines that split the sum into easier parts (shown as a picture). The last line ends with "= ?" and must NOT show the final answer.`,
  steps: `- "answer": "x=7" for an equation in x; otherwise just the value: a whole number ("15", "-3") or a fraction in simplest form ("7/8", "-1/4"). No decimals unless the answer cannot be written any other way, no units, no "or".
- "steps": 2 to 4 lines of worked solution, one line of maths each (e.g. "2x = 10 + 4"). The last line gives the answer.`,
};

function systemPrompt(version, grade) {
  const v = VERSIONS[version];
  return `You write maths questions for Tower of Arithmetic, a fantasy maths game for South African learners. This learner is in GRADE ${grade}. Follow the CAPS curriculum for Grade ${grade}${grade >= 10 ? ' Mathematics (pure maths, not Mathematical Literacy)' : ''}: never use work from a higher grade, and never make it easier than the level asks.

You will be given topics. Each topic has three difficulty levels with a description and two examples. Every question must:
- belong to its topic ONLY (an algebra question is never a fractions or data question),
- match its level's description exactly (kind of sum and size of numbers),
- be written in the same style as the examples, but with DIFFERENT numbers (never copy an example),
- have an answer that is exactly right. Work each one out carefully before you write it.

Reply with ONLY a JSON object: {"questions": [ ... ]}. Each question has:
- "topic": the topic id.
- "level": 1, 2 or 3.
- "instruction": one short line shown above the sum, in plain friendly words (at most 90 characters), e.g. "Solve for x · show each step", "How many altogether?", "Find the median". If the level description says the instruction must contain something, put it there.
- "display": ONLY the sum itself, written like the examples, using × ÷ − and ? for the unknown (at most 45 characters). No words except the ones the examples use ("of", "Mean of", "Median of"). Write fractions as 3/4 and powers as 3² or 2^(x + 1).
- "hints": exactly 3 short hints, from a gentle nudge to almost the answer. The first two must not give the answer.
${FORMAT[v.answerMode]}
- "story": only when asked for a word problem: one or two friendly sentences (at most 160 characters) that set the sum in the tower (potions, dragons, gold, spell books). The display must still be the plain sum that the story describes.

No LaTeX, no markdown, no units in "answer". Never repeat a question.`;
}

function userPrompt({ grade, topics, counts, stories, avoid }) {
  const blocks = topics.map((topic) => {
    const levels = LEVELS.map((level) => `  Level ${level} (${counts[level]} question${counts[level] === 1 ? '' : 's'}): ${GUIDE[grade][topic][level - 1]}`);
    return `Topic "${topic}":\n${levels.join('\n')}`;
  });
  const extra = stories
    ? `\nAlso make ONE extra word problem (with a "story") for each level of each topic. These are for the tower's puzzle doors.`
    : '';
  const skip = avoid.length ? `\nThe learner has already had these, so do not use them again: ${avoid.join(' ; ')}` : '';
  return `Make questions for Grade ${grade}.\n\n${blocks.join('\n\n')}${extra}${skip}`;
}

const text = (v, max = 200) => (typeof v === 'string' ? v.trim().replace(/\s+/g, ' ').slice(0, max) : '');
const gcd = (a, b) => (b ? gcd(b, a % b) : Math.abs(a));
const sameSum = (a, b) => a.replace(/\s+/g, '') === b.replace(/\s+/g, '');

// The answer written the one way the game expects, or null if it can't be
// typed on that version's keypad.
//   tap    "12"
//   type   "144", "5/8", "4.25"        (never negative)
//   steps  "x=7", "-3", "7/8", "x=-2"
export function answerForm(mode, raw, { decimals = false } = {}) {
  let s = String(raw ?? '').replace(/\s+/g, '').replace(/[−–]/g, '-').replace(/°/g, '').replace(/(\d),(\d)/g, '$1.$2').toLowerCase();
  let letter = '';
  const named = s.match(/^([a-z])=(.+)$/);
  if (named) {
    if (mode !== 'steps') return null;
    // Only x is asked for by name ("x=7"); for n the number alone is the answer
    letter = named[1] === 'x' ? 'x=' : '';
    s = named[2];
  }
  const fraction = s.match(/^(-?)(\d{1,4})\/(\d{1,4})$/);
  if (fraction) {
    if (mode === 'tap') return null;
    const [n, d] = [Number(fraction[2]), Number(fraction[3])];
    if (d === 0) return null;
    const g = gcd(n, d);
    s = `${n === 0 ? '' : fraction[1]}${d / g === 1 ? n / g : `${n / g}/${d / g}`}`;
  } else if (/^-?\d{1,7}$/.test(s)) {
    s = String(Number(s));
  } else if (/^-?\d{1,5}\.\d{1,2}$/.test(s)) {
    if (mode === 'tap' || !decimals) return null;
    s = String(Number(s));
  } else {
    return null;
  }
  if (s.startsWith('-') && mode !== 'steps') return null;
  if (mode === 'tap' && Number(s) > 9999) return null;
  return `${letter}${s}`;
}

// Three answers to tap: the AI's if they are usable, otherwise near misses.
function tapChoices(raw, answer) {
  const given = Array.isArray(raw) ? [...new Set(raw.map((c) => String(c).trim()))] : [];
  if (given.length === 3 && given.includes(answer) && given.every((c) => /^\d{1,4}$/.test(c))) return given;
  const n = Number(answer);
  const wrong = [n + 1, n > 10 ? n - 10 : n + 2].map((w) => (w === n || w < 0 ? n + 3 : w));
  return [String(wrong[1]), answer, String(wrong[0])].sort((a, b) => Number(a) - Number(b));
}

// Dots to count for the youngest players, worked out from the sum itself.
export function juniorPicture(display) {
  const m = display.replace(/\s+/g, '').replace(/−/g, '-').match(/^(\d+)([+\-×x*])(\d+)=\?$/);
  if (!m) return null;
  const a = Number(m[1]);
  const b = Number(m[3]);
  if (m[2] === '+') return a + b <= 20 ? { kind: 'dots', groups: [{ count: a, color: 'gold' }, { count: b, color: 'pink' }] } : null;
  if (m[2] === '-') return a <= 20 ? { kind: 'takeAway', total: a, gone: b } : null;
  if (a <= 5 && b <= 5 && a * b <= 20) return { kind: 'groups', groups: a, each: b };
  return null;
}

// Turn one AI question into the game's format, or null if it isn't safe to
// use. `why` (optional) collects the reason, for the server log.
export function cleanQuestion(raw, { version, grade, topics }, why = () => null) {
  const mode = VERSIONS[version].answerMode;
  const q = {
    type: text(raw?.topic, 40),
    level: Math.round(Number(raw?.level)),
    instruction: text(raw?.instruction, 110),
    display: text(raw?.display, 60),
    hints: Array.isArray(raw?.hints) ? raw.hints.map((h) => text(h, 220)).filter(Boolean).slice(0, 3) : [],
  };
  if (!topics.includes(q.type) || !LEVELS.includes(q.level)) return why('wrong topic or level');
  if (!q.instruction || !q.display || q.hints.length < 3) return why('something is missing');
  if (/[\\$]|\\frac|\*\*/.test(`${q.display}${q.instruction}`)) return why('not plain text');
  if (!onTopic(q.type, q.display, grade)) return why('not on topic');
  if (examplesOf(grade, q.type, q.level).some((example) => sameSum(example, q.display))) return why('copied an example');

  // 1. The answer, worked out by code
  const solved = solveQuestion({ instruction: q.instruction, display: q.display, topic: q.type });
  if (!solved || !Number.isFinite(solved.value)) return why('cannot be checked by code');

  // 2. The AI's answer must be that answer, and typeable
  const decimals = grade === 6 && q.type === 'fractions';
  let answer = answerForm(mode, raw?.answer, { decimals });
  if (!answer) return why('answer cannot be typed');
  // "Solve for x" is always answered as x = ...
  if (mode === 'steps' && /x/i.test(q.display) && !q.display.includes('?') && !answer.startsWith('x=')) answer = `x=${answer}`;
  let value;
  try {
    value = answerValue(answer);
  } catch {
    return why('answer is not a number');
  }
  if (!close(value, solved.value)) return why(`wrong answer (said ${answer}, is ${solved.value})`);
  q.answer = answer;

  if (mode === 'tap') {
    q.choices = tapChoices(raw?.choices, answer);
    q.picture = juniorPicture(q.display);
  } else if (mode === 'type') {
    const parts = Array.isArray(raw?.breakdown) ? raw.breakdown.map((p) => text(p, 60)).filter(Boolean).slice(0, 3) : [];
    q.picture = { kind: 'breakdown', parts: parts.length >= 2 ? parts : q.hints.slice(0, 2) };
    if (answer.includes('/')) q.simplest = true;
  } else {
    const steps = Array.isArray(raw?.steps) ? raw.steps.map((s) => text(s, 60)).filter(Boolean).slice(0, 4) : [];
    if (steps.length < 2) return why('no worked steps');
    q.steps = steps;
    const bare = answer.replace(/^x=/, '');
    q.accepted = [...new Set([answer, bare, `=${bare}`])];
    if (bare.includes('/')) q.simplest = true;
  }

  const story = text(raw?.story, 200);
  if (story) q.story = story;
  return q;
}

// Make, check and return the questions, grouped by topic and level.
export async function makeQuestions({ version, grade, topics, avoid = [] }, ask) {
  if (!VERSIONS[version]) throw new AppError(`Unknown version "${version}".`, 400);
  const g = gradeFor(version, grade);
  const allowed = topicsFor(g);
  const asked = Array.isArray(topics) && topics.length ? topics : allowed;
  const wanted = asked.filter((t) => allowed.includes(t));
  // Topics the app makes itself (geometry, measurement) are fine to ask
  // for: there is just nothing for the AI to do
  if (!wanted.length) return { grade: g, questions: {}, rejected: 0 };

  const counts = countsFor(wanted.length);
  const stories = wanted.length <= 2;
  const perTopic = LEVELS.reduce((n, level) => n + counts[level] + (stories ? 1 : 0), 0);
  const use = wanted.slice(0, Math.max(1, Math.floor(MAX_TOTAL / perTopic)));
  const seen = (Array.isArray(avoid) ? avoid : []).map((a) => text(a, 60)).filter(Boolean).slice(0, 30);

  const reply = await ask({
    system: systemPrompt(version, g),
    user: userPrompt({ grade: g, topics: use, counts, stories, avoid: seen }),
    temperature: 0.7,
    maxTokens: 7000,
    timeoutMs: 40000,
  });

  const grouped = Object.fromEntries(use.map((t) => [t, { 1: [], 2: [], 3: [] }]));
  const reasons = {};
  let rejected = 0;
  for (const raw of Array.isArray(reply?.questions) ? reply.questions : []) {
    const q = cleanQuestion(raw, { version, grade: g, topics: use }, (reason) => {
      reasons[reason.split(' (')[0]] = (reasons[reason.split(' (')[0]] ?? 0) + 1;
      return null;
    });
    const repeat = q && [...grouped[q.type][q.level], ...seen.map((display) => ({ display }))].some((other) => sameSum(other.display, q.display));
    if (!q || repeat) {
      rejected++;
      continue;
    }
    grouped[q.type][q.level].push(q);
  }
  if (rejected) console.log(`AI questions: threw away ${rejected}`, reasons);
  return { grade: g, questions: grouped, rejected };
}

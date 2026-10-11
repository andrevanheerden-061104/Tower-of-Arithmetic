import { AppError } from '../lib/errors.js';
import { checks } from '../maths/evaluate.js';
import { VERSIONS, topicsFor } from './topics.js';

// ---------------------------------------------------------------------------
// AI maths questions
//
// One request makes a batch of questions for a whole run (a few per topic),
// so fights never wait for the network. Every question is checked by code
// before it reaches a child: the AI gives a `check` equation, and the
// calculator in maths/evaluate.js puts the answer back in to prove it.
// Questions that fail the check (or are missing anything) are thrown away.
//
// The questions use the same fields as the game's own question bank
// (Tower-of-Arithmetic/src/game/questions.js), so the screens show them
// without any changes.
// ---------------------------------------------------------------------------

const MAX_TOTAL = 24;

function systemPrompt(version) {
  const v = VERSIONS[version];
  const answerRules = {
    tap: '- "choices": exactly 3 different answers as strings, one of them the correct answer, the other two close but wrong (common mistakes). Keep numbers small and friendly.',
    type: '- "breakdown": 2 or 3 short lines that break the sum into easier parts (shown as a picture). The last line ends with "= ?".',
    steps:
      '- "steps": 2 to 4 lines of worked solution, each one line of maths (e.g. "2x = 10 + 4").\n- "accepted": other ways of writing the same answer that should also count (e.g. ["x=7", "7"]).',
  }[v.answerMode];

  return `You write maths questions for Tower of Arithmetic, a fantasy maths game for South African learners in ${v.grades}, following the CAPS curriculum. The learner casts spells by solving them, so keep the language friendly and encouraging, never scary.

Reply with ONLY a JSON object: {"questions": [ ... ]}. Each question has:
- "topic": the topic id it was asked for.
- "instruction": one short line above the sum (e.g. "Solve for x · show each step", "How many altogether?").
- "display": the sum exactly as shown, using the symbols × ÷ − and ? for the unknown (e.g. "6 × 24 = ?", "2x − 4 = 10", "3, 7, 11, 15, ?").
- "answer": the correct answer as text ("144", "x=7", "7/8", "55").
- "check": ONE equation, using only numbers, + − × ÷ ^ ( ) and x or ?, that is true when the answer is put in place of x or ?. For "6 × 24 = ?" use "6 × 24 = ?". For "Median of 4, 9, 2, 7, 5" use "5 = ?". For a pattern "3, 7, 11, ?" use "11 + 4 = ?". For a rectangle 8 m by 5 m perimeter use "2 × 8 + 2 × 5 = ?".
- "hints": exactly 3 hints, from a gentle nudge to almost the answer. Socratic: ask a guiding question or point at the next step; never give the final answer in the first two.
${answerRules}

Rules: every answer must be exactly right; whole numbers unless the topic is fractions; no LaTeX, no markdown, no units inside "answer"; questions get harder as the floor number goes up; never repeat a question in the batch.`;
}

function userPrompt({ version, topics, perTopic, floor, floors }) {
  return `Make ${perTopic} questions for EACH of these topics: ${topics.join(', ')}.
The player is on floor ${floor} of ${floors}: start at that level of difficulty and make each next question a little harder.
Topic details:
${topics.map((t) => `- ${t}: ${VERSIONS[version].topics[t]}`).join('\n')}`;
}

const text = (v, max = 200) => (typeof v === 'string' ? v.trim().slice(0, max) : '');

// Turn one AI question into the game's format, or null if it isn't safe to use.
export function cleanQuestion(raw, version, topics) {
  const v = VERSIONS[version];
  const q = {
    type: text(raw?.topic, 40),
    instruction: text(raw?.instruction, 80),
    display: text(raw?.display, 80),
    answer: text(raw?.answer, 30).replace(/\s+/g, ''),
    hints: Array.isArray(raw?.hints) ? raw.hints.map((h) => text(h, 220)).filter(Boolean).slice(0, 3) : [],
  };
  if (!topics.includes(q.type) || !q.instruction || !q.display || !q.answer || q.hints.length < 3) return null;
  // The maths must check out
  if (!checks(text(raw?.check, 120), q.answer)) return null;

  if (v.answerMode === 'tap') {
    const choices = Array.isArray(raw?.choices) ? [...new Set(raw.choices.map((c) => text(String(c), 10)))] : [];
    if (choices.length !== 3 || !choices.includes(q.answer)) return null;
    q.choices = choices;
    q.picture = juniorPicture(q.display);
  } else if (v.answerMode === 'type') {
    const parts = Array.isArray(raw?.breakdown) ? raw.breakdown.map((p) => text(p, 60)).filter(Boolean).slice(0, 3) : [];
    q.picture = parts.length >= 2 ? { kind: 'breakdown', parts } : null;
  } else {
    const steps = Array.isArray(raw?.steps) ? raw.steps.map((s) => text(s, 60)).filter(Boolean).slice(0, 4) : [];
    if (steps.length < 2) return null;
    q.steps = steps;
    const accepted = Array.isArray(raw?.accepted) ? raw.accepted.map((a) => text(String(a), 30)) : [];
    const bare = q.answer.replace(/^[a-z]\w*=/i, '');
    q.accepted = [...new Set([q.answer, bare, ...accepted.filter((a) => checks(text(raw?.check, 120), a))])];
  }
  return q;
}

// Dots to count for the youngest players, worked out from the sum itself.
export function juniorPicture(display) {
  const m = display.replace(/\s+/g, '').replace(/−/g, '-').match(/^(\d+)([+\-×x*])(\d+)=\?$/);
  if (!m) return null;
  const a = Number(m[1]);
  const b = Number(m[3]);
  if (m[2] === '+' && a + b <= 20) return { kind: 'dots', groups: [{ count: a, color: 'gold' }, { count: b, color: 'pink' }] };
  if (m[2] === '-' && a <= 20) return { kind: 'takeAway', total: a, gone: b };
  if (a <= 6 && b <= 10) return { kind: 'groups', groups: a, each: b };
  return null;
}

// Make, check and return the questions, grouped by topic:
// { algebra: [q, q, q], fractions: [...] }
export async function makeQuestions({ version, topics, perTopic = 3, floor = 1, floors = 10 }, ask) {
  if (!VERSIONS[version]) throw new AppError(`Unknown version "${version}".`, 400);
  const allowed = topicsFor(version);
  const wanted = (Array.isArray(topics) && topics.length ? topics : allowed).filter((t) => allowed.includes(t));
  if (!wanted.length) throw new AppError('None of those topics belong to this version.', 400);
  const each = Math.max(1, Math.min(Number(perTopic) || 3, Math.floor(MAX_TOTAL / wanted.length)));

  const reply = await ask({
    system: systemPrompt(version),
    user: userPrompt({ version, topics: wanted, perTopic: each, floor, floors }),
    temperature: 0.8,
    maxTokens: 6000,
  });

  const grouped = Object.fromEntries(wanted.map((t) => [t, []]));
  let rejected = 0;
  for (const raw of Array.isArray(reply?.questions) ? reply.questions : []) {
    const q = cleanQuestion(raw, version, wanted);
    if (!q) {
      rejected++;
      continue;
    }
    if (!grouped[q.type].some((other) => other.display === q.display)) grouped[q.type].push(q);
  }
  return { questions: grouped, rejected };
}

import { gradeFor } from './curriculum.js';
import { VERSIONS } from './topics.js';

// ---------------------------------------------------------------------------
// End of a run: Orrin tells the player what went well and what to practise.
//
// The facts are worked out by CODE from the run's real results (how many
// right per topic, which topic went worst, which sums were missed). The AI
// only puts those facts into kind words and reads the missed sums to spot
// the kind of mistake. Its message is thrown away if it mentions a number
// that isn't in the facts, so the advice can't be made up. Nothing about
// the player (name, email) is sent to the AI.
// ---------------------------------------------------------------------------

const LABELS = {
  adding: 'adding',
  takingAway: 'taking away',
  times: 'times (groups)',
  patterns: 'number patterns',
  multiplication: 'multiplying',
  division: 'dividing',
  fractions: 'fractions',
  measurement: 'measurement',
  data: 'data handling',
  algebra: 'algebra',
  geometry: 'geometry',
  arithmetic: 'integers and order of operations',
};

const count = (n) => Math.max(0, Math.round(Number(n) || 0));
const clip = (v, max) => String(v ?? '').replace(/\s+/g, ' ').trim().slice(0, max);

export function cleanStats(topics) {
  if (!Array.isArray(topics)) return [];
  return topics
    .map((t) => {
      const attempts = count(t?.attempts);
      const correct = Math.min(attempts, count(t?.correct));
      return {
        topic: clip(t?.topic, 30),
        attempts,
        correct,
        errors: attempts - correct,
        accuracy: attempts ? Math.round((correct / attempts) * 100) : 0,
        avgSeconds: Math.round((Number(t?.timeMs) || 0) / Math.max(1, attempts) / 1000),
        hints: count(t?.hints),
      };
    })
    .filter((t) => t.topic && t.attempts > 0)
    .slice(0, 12);
}

// The sums the player got wrong: what was asked, the right answer and
// what they answered.
export function cleanMistakes(mistakes) {
  if (!Array.isArray(mistakes)) return [];
  return mistakes
    .map((m) => ({
      topic: clip(m?.topic, 30),
      level: Math.min(3, Math.max(1, count(m?.level) || 1)),
      question: clip(m?.display ?? m?.question, 80),
      answer: clip(m?.answer, 30),
      given: clip(m?.given, 40),
    }))
    .filter((m) => m.topic && m.question && m.answer)
    .slice(0, 10);
}

// What the numbers say: the strongest topic and the one to practise.
export function runFacts(stats) {
  const attempts = stats.reduce((n, s) => n + s.attempts, 0);
  const correct = stats.reduce((n, s) => n + s.correct, 0);
  const byWorst = [...stats].sort((a, b) => a.accuracy - b.accuracy || b.errors - a.errors || b.hints - a.hints);
  const weakest = byWorst.find((s) => s.errors > 0) ?? null;
  const strongest = [...stats].sort((a, b) => b.accuracy - a.accuracy || b.attempts - a.attempts)[0] ?? null;
  return {
    attempts,
    correct,
    accuracy: attempts ? Math.round((correct / attempts) * 100) : 0,
    weakest,
    strongest: strongest && strongest.correct > 0 && strongest !== weakest ? strongest : null,
  };
}

// Every number the message is allowed to mention.
function allowedNumbers(stats, facts, mistakes, extra) {
  const numbers = new Set(extra.map(String));
  const add = (n) => numbers.add(String(n));
  [facts.attempts, facts.correct, facts.accuracy, facts.attempts - facts.correct].forEach(add);
  stats.forEach((s) => [s.attempts, s.correct, s.errors, s.accuracy, s.hints, s.avgSeconds].forEach(add));
  // Numbers inside the missed sums themselves may be quoted
  mistakes.forEach((m) => `${m.question} ${m.answer} ${m.given}`.match(/\d+(?:\.\d+)?/g)?.forEach(add));
  ['1', '2', '3', '10', '100', '180', '360'].forEach(add); // "one step", "a ten", angle rules
  return numbers;
}

export function sticksToFacts(summary, allowed) {
  return (summary.match(/\d+(?:\.\d+)?/g) ?? []).every((n) => allowed.has(n));
}

export async function makeSummary({ version, grade, won, floorsCleared, floors, topics, mistakes }, ask) {
  if (!VERSIONS[version]) return null;
  const stats = cleanStats(topics);
  if (!stats.length) return null;
  const missed = cleanMistakes(mistakes);
  const facts = runFacts(stats);
  const g = gradeFor(version, grade);
  const label = (topic) => LABELS[topic] ?? topic;
  const focusTopic = facts.weakest?.topic ?? null;

  const lines = [
    `Grade ${g}. The learner ${won ? `cleared all ${count(floors)} floors of the tower` : `reached floor ${count(floorsCleared)} of ${count(floors)}`}.`,
    `Overall: ${facts.correct} right out of ${facts.attempts} (${facts.accuracy}%).`,
    'Per topic:',
    ...stats.map((s) => `- ${label(s.topic)}: ${s.correct} right out of ${s.attempts} (${s.accuracy}%), ${s.errors} wrong, ${s.hints} hints, about ${s.avgSeconds}s each`),
    facts.strongest ? `Strongest topic: ${label(facts.strongest.topic)}.` : 'No clear strongest topic.',
    facts.weakest ? `Topic to practise (most trouble): ${label(facts.weakest.topic)}.` : 'There were NO wrong answers.',
    missed.length ? 'Sums the learner got wrong (question → right answer; the learner answered):' : '',
    ...missed.map((m) => `- [${label(m.topic)}, level ${m.level}] ${m.question} → ${m.answer}; answered ${m.given || 'nothing'}`),
  ].filter(Boolean);

  const reply = await ask({
    system: `You are Orrin, the kind old Archmage in Tower of Arithmetic, a maths game for South African learners in ${VERSIONS[version].grades}. Write the end-of-climb message to the learner, using ONLY the facts you are given.
- 3 or 4 short sentences, spoken to the learner ("you").
- First, praise one real strength from the facts.
- Then name the topic to practise that the facts give you (never choose a different one). ${facts.weakest ? 'Look at the sums the learner got wrong: if you can see the kind of mistake (for example a sign error, forgetting to divide both sides, adding instead of multiplying, not simplifying, a times-table slip), say so plainly. If you cannot tell, do not guess.' : 'There were no wrong answers, so suggest trying higher-level spell cards for harder sums.'}
- End with ONE concrete thing to do next time for that topic.
- Only use numbers that appear in the facts. Never invent scores, percentages or sums.
- No markdown, no lists, no emojis.${version === 'junior' ? ' Use very simple words a 7-year-old understands.' : ''}
Reply with ONLY JSON: {"summary": "..."}`,
    user: lines.join('\n'),
    temperature: 0.4,
    maxTokens: 900,
    timeoutMs: 15000,
  });

  const summary = typeof reply?.summary === 'string' ? reply.summary.trim().replace(/\s+/g, ' ').slice(0, 700) : '';
  if (!summary) return null;
  // Made-up numbers: don't show it (the app then shows its own summary)
  if (!sticksToFacts(summary, allowedNumbers(stats, facts, missed, [g, count(floors), count(floorsCleared)]))) {
    console.log('Run summary thrown away: it used numbers that are not in the results.');
    return null;
  }
  return { summary, focusTopic };
}

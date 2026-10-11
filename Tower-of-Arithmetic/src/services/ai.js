import { apiPost } from '../lib/api';
import { poolIsEmpty } from '../game/questionPool';

// ---------------------------------------------------------------------------
// The AI features, through our backend. Each one fails quietly: the game
// always has its own sums, hints and advice to fall back on.
// ---------------------------------------------------------------------------

// A batch of sums for a run, made for the player's grade and grouped by
// topic and difficulty level: { algebra: { 1: [...], 2: [...], 3: [...] } }.
// `topics` are the maths topics the run can ask (one for a focused dungeon,
// all of them for mixed); `avoid` are sums the run already has.
// Returns null if the server can't be reached or sent nothing usable.
export async function fetchQuestionPool({ version, grade, topics, avoid = [] }) {
  try {
    const { questions } = await apiPost('/api/questions', { version: version.id, grade, topics, avoid: avoid.slice(-30) }, { timeoutMs: 60000 });
    return poolIsEmpty(questions) ? null : questions;
  } catch {
    return null;
  }
}

// Orrin's explanation of a wrong answer, or null.
export async function fetchHint({ version, grade, question, givenAnswer }) {
  try {
    const { hint } = await apiPost('/api/hint', {
      version: version.id,
      grade,
      question: { display: question.display, instruction: question.instruction, answer: question.answer },
      givenAnswer,
    });
    return hint || null;
  } catch {
    return null;
  }
}

// Orrin's end-of-run message, written from the run's real results and the
// sums that were missed. Returns { summary, focusTopic } or null.
export async function fetchRunSummary({ version, grade, won, floorsCleared, floors, topicStats, mistakes }) {
  try {
    const topics = Object.entries(topicStats ?? {}).map(([topic, s]) => ({ topic, ...s }));
    if (!topics.length) return null;
    const reply = await apiPost('/api/run-summary', { version: version.id, grade, won, floorsCleared, floors, topics, mistakes: mistakes ?? [] });
    return reply?.summary ? reply : null;
  } catch {
    return null;
  }
}

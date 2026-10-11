import { apiPost } from '../lib/api';

// ---------------------------------------------------------------------------
// The AI features, through our backend. Each one fails quietly: the game
// always has its own questions and hints to fall back on.
// ---------------------------------------------------------------------------

// A batch of questions for a whole run, grouped by topic. `topics` are the
// maths types the run can ask (one for a focused dungeon, all for mixed).
// Returns null if the server can't be reached.
export async function fetchQuestionPool({ version, topics, floors }) {
  try {
    const perTopic = topics.length === 1 ? 10 : Math.max(2, Math.floor(24 / topics.length));
    const { questions } = await apiPost('/api/questions', { version: version.id, topics, perTopic, floor: 1, floors }, { timeoutMs: 45000 });
    const usable = Object.fromEntries(Object.entries(questions ?? {}).filter(([, list]) => list.length));
    return Object.keys(usable).length ? usable : null;
  } catch {
    return null;
  }
}

// Orrin's explanation of a wrong answer, or null.
export async function fetchHint({ version, question, givenAnswer }) {
  try {
    const { hint } = await apiPost('/api/hint', {
      version: version.id,
      question: { display: question.display, instruction: question.instruction, answer: question.answer },
      givenAnswer,
    });
    return hint || null;
  } catch {
    return null;
  }
}

// Orrin's end-of-run message, or null.
export async function fetchRunSummary({ version, won, floorsCleared, floors, topicStats }) {
  try {
    const topics = Object.entries(topicStats ?? {}).map(([topic, s]) => ({ topic, ...s }));
    if (!topics.length) return null;
    return await apiPost('/api/run-summary', { version: version.id, won, floorsCleared, floors, topics });
  } catch {
    return null;
  }
}

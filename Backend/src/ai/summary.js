import { VERSIONS } from './topics.js';

// ---------------------------------------------------------------------------
// End of a run: Orrin looks at how the player did per topic and says, in a
// few sentences, what went well and what to practise next. The app sends
// the numbers; nothing about the player (name, email) is sent to the AI.
// ---------------------------------------------------------------------------

export function cleanStats(topics) {
  if (!Array.isArray(topics)) return [];
  return topics
    .map((t) => ({
      topic: String(t?.topic ?? '').slice(0, 30),
      attempts: Math.max(0, Math.round(Number(t?.attempts) || 0)),
      correct: Math.max(0, Math.round(Number(t?.correct) || 0)),
      avgSeconds: Math.max(0, Math.round((Number(t?.timeMs) || 0) / Math.max(1, Number(t?.attempts) || 1) / 1000)),
      hints: Math.max(0, Math.round(Number(t?.hints) || 0)),
    }))
    .filter((t) => t.topic && t.attempts > 0)
    .slice(0, 12);
}

export async function makeSummary({ version, won, floorsCleared, floors, topics }, ask) {
  if (!VERSIONS[version]) return null;
  const stats = cleanStats(topics);
  if (!stats.length) return null;
  const reply = await ask({
    system: `You are Orrin, the kind old Archmage in Tower of Arithmetic, a maths game for South African learners in ${VERSIONS[version].grades}. Write a short end-of-climb message to the learner: 2 to 4 sentences. Celebrate one real strength from the numbers, then name ONE topic to practise next and why, kindly. No markdown, no lists, no made-up numbers. ${version === 'junior' ? 'Use very simple words.' : ''} Reply with ONLY JSON: {"summary": "...", "focusTopic": "topic id to practise next"}`,
    user: `The learner ${won ? 'cleared the whole tower' : `reached floor ${floorsCleared} of ${floors}`}.\nResults per topic (attempts, correct, average seconds, hints used):\n${stats
      .map((s) => `- ${s.topic}: ${s.attempts} tried, ${s.correct} correct, ${s.avgSeconds}s each, ${s.hints} hints`)
      .join('\n')}`,
    temperature: 0.6,
    maxTokens: 700,
    timeoutMs: 15000,
  });
  const summary = typeof reply?.summary === 'string' ? reply.summary.trim().slice(0, 600) : '';
  if (!summary) return null;
  const focus = stats.some((s) => s.topic === reply?.focusTopic) ? reply.focusTopic : null;
  return { summary, focusTopic: focus };
}

import { tidy } from '../maths/evaluate.js';
import { gradeFor } from './curriculum.js';
import { VERSIONS } from './topics.js';

// ---------------------------------------------------------------------------
// After a wrong answer: Orrin, the old Archmage, explains the mistake in one
// or two kind sentences and asks a guiding question. He never gives the
// final answer, and the reply is thrown away if it does.
// ---------------------------------------------------------------------------

function systemPrompt(version, grade) {
  return `You are Orrin, the kind old Archmage in Tower of Arithmetic, a maths game for South African learners. This learner is in Grade ${gradeFor(version, grade)}: only use methods taught by that grade (CAPS). A learner just gave a wrong answer. In 1 or 2 short sentences: name the likely mistake gently (e.g. a sign error, forgot to divide both sides, added instead of multiplied) and ask ONE guiding question that leads to the next step. Never say the final answer. No markdown. Use simple words${version === 'junior' ? ' a 7-year-old understands' : ''}. Reply with ONLY JSON: {"hint": "..."}`;
}

export async function makeHint({ version, grade, question, givenAnswer, steps }, ask) {
  if (!VERSIONS[version]) return null;
  const reply = await ask({
    system: systemPrompt(version, grade),
    user: `Question: ${question?.display}\nInstruction: ${question?.instruction ?? ''}\nCorrect answer (do NOT reveal it): ${question?.answer}\nThe learner answered: ${givenAnswer}${
      Array.isArray(steps) && steps.length ? `\nTheir working: ${steps.join(' | ')}` : ''
    }`,
    temperature: 0.4,
    maxTokens: 600,
    timeoutMs: 15000,
  });
  const hint = typeof reply?.hint === 'string' ? reply.hint.trim().slice(0, 300) : '';
  if (!hint || givesAway(hint, question?.answer)) return null;
  return hint;
}

// Does the hint contain the answer itself (e.g. "x = 7")?
export function givesAway(hint, answer) {
  if (!answer) return false;
  const bare = tidy(answer).replace(/^[a-z]\w*=/, '');
  const words = tidy(hint);
  if (!bare) return false;
  return new RegExp(`(^|[^0-9.])${bare.replace(/[.*+?^${}()|[\]\\/]/g, '\\$&')}([^0-9.]|$)`).test(words);
}

import { Router } from 'express';
import { makeHint } from '../ai/hints.js';
import { makeQuestions } from '../ai/questions.js';
import { makeSummary } from '../ai/summary.js';
import { rateLimit } from '../middleware/rateLimit.js';

// The three AI features. `ask` is the Groq call (swapped for a fake in tests).
export function aiRoutes(ask) {
  const router = Router();

  // POST /api/questions
  // { version, grade, topics: ["algebra", ...], avoid: ["2x − 4 = 10", ...] }
  // → { grade, questions: { algebra: { 1: [...], 2: [...], 3: [...] } }, rejected }
  // Called when a run starts (and again if it runs low). Sums are made for
  // the player's grade, three difficulty levels per topic, and each answer
  // is worked out again by code before it is sent. If this fails, the game
  // uses its own sum maker, so the player can always play.
  router.post('/questions', rateLimit({ limit: 6, windowMs: 60_000 }), async (req, res) => {
    const { version, grade, topics, avoid } = req.body ?? {};
    res.json(await makeQuestions({ version, grade, topics, avoid }, ask));
  });

  // POST /api/hint
  // { version, grade, question: { display, instruction, answer }, givenAnswer, steps }
  // → { hint } (hint is null if the AI couldn't give a safe one)
  router.post('/hint', rateLimit({ limit: 20, windowMs: 60_000 }), async (req, res) => {
    const { version, grade, question, givenAnswer, steps } = req.body ?? {};
    if (!question?.display || givenAnswer == null) return res.status(400).json({ error: 'Send the question and the answer given.' });
    const hint = await makeHint({ version, grade, question, givenAnswer: String(givenAnswer).slice(0, 60), steps }, ask);
    res.json({ hint });
  });

  // POST /api/run-summary
  // { version, grade, won, floorsCleared, floors,
  //   topics: [{ topic, attempts, correct, timeMs, hints }],
  //   mistakes: [{ topic, level, display, answer, given }] }
  // → { summary, focusTopic } (summary is null if there was nothing to say,
  //   or the AI's message didn't stick to the results)
  router.post('/run-summary', rateLimit({ limit: 6, windowMs: 60_000 }), async (req, res) => {
    const { version, grade, won, floorsCleared, floors, topics, mistakes } = req.body ?? {};
    const result = await makeSummary({ version, grade, won: Boolean(won), floorsCleared, floors, topics, mistakes }, ask);
    res.json(result ?? { summary: null, focusTopic: null });
  });

  return router;
}

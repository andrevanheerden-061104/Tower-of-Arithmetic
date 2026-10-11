import { Router } from 'express';
import { makeHint } from '../ai/hints.js';
import { makeQuestions } from '../ai/questions.js';
import { makeSummary } from '../ai/summary.js';
import { rateLimit } from '../middleware/rateLimit.js';

// The three AI features. `ask` is the Groq call (swapped for a fake in tests).
export function aiRoutes(ask) {
  const router = Router();

  // POST /api/questions
  // { version, topics: ["algebra", ...], perTopic, floor, floors }
  // → { questions: { algebra: [ ... ], ... }, rejected }
  // Called once when a run starts. If it fails, the game uses its own
  // question bank, so the player can always play.
  router.post('/questions', rateLimit({ limit: 6, windowMs: 60_000 }), async (req, res) => {
    const { version, topics, perTopic, floor, floors } = req.body ?? {};
    const result = await makeQuestions(
      { version, topics, perTopic, floor: Number(floor) || 1, floors: Number(floors) || 10 },
      ask,
    );
    res.json(result);
  });

  // POST /api/hint
  // { version, question: { display, instruction, answer }, givenAnswer, steps }
  // → { hint } (hint is null if the AI couldn't give a safe one)
  router.post('/hint', rateLimit({ limit: 20, windowMs: 60_000 }), async (req, res) => {
    const { version, question, givenAnswer, steps } = req.body ?? {};
    if (!question?.display || givenAnswer == null) return res.status(400).json({ error: 'Send the question and the answer given.' });
    const hint = await makeHint({ version, question, givenAnswer: String(givenAnswer).slice(0, 60), steps }, ask);
    res.json({ hint });
  });

  // POST /api/run-summary
  // { version, won, floorsCleared, floors, topics: [{ topic, attempts, correct, timeMs, hints }] }
  // → { summary, focusTopic } (summary is null if there was nothing to say)
  router.post('/run-summary', rateLimit({ limit: 6, windowMs: 60_000 }), async (req, res) => {
    const { version, won, floorsCleared, floors, topics } = req.body ?? {};
    const result = await makeSummary({ version, won: Boolean(won), floorsCleared, floors, topics }, ask);
    res.json(result ?? { summary: null, focusTopic: null });
  });

  return router;
}

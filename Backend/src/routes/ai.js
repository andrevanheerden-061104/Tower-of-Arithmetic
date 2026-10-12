import express, { Router } from 'express';
import { makeHint } from '../ai/hints.js';
import { readHandwriting, readSpeech } from '../ai/ink.js';
import { makeQuestions } from '../ai/questions.js';
import { makeSummary } from '../ai/summary.js';
import { fileFromMultipart } from '../lib/multipart.js';
import { rateLimit } from '../middleware/rateLimit.js';

// The AI features. `ask` is the Groq chat call and `media` the speech and
// picture calls (both swapped for fakes in tests).
export function aiRoutes(ask, media) {
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

  // POST /api/speech   (multipart/form-data with one file: "file")
  // → { heard, maths }  e.g. { heard: 'x equals seven', maths: 'x = 7' }
  // "Speak" on the answer keypad: a short recording of the player saying
  // their answer or step, turned into maths with the keypad's keys.
  router.post('/speech', rateLimit({ limit: 20, windowMs: 60_000 }), express.raw({ type: 'multipart/form-data', limit: '4mb' }), async (req, res) => {
    if (!media) return res.status(503).json({ error: 'Speaking answers is not set up on the server.' });
    const file = fileFromMultipart(req.body, req.get('content-type'));
    if (!file) return res.status(400).json({ error: 'Send the recording as "file".' });
    res.json(await readSpeech(file, media));
  });

  // POST /api/handwriting
  // { strokes: [[x, y, x, y, ...], ...] }  → { maths }
  // "Draw" on the answer keypad: the pen strokes are drawn as a picture
  // here and read by a vision model.
  router.post('/handwriting', rateLimit({ limit: 20, windowMs: 60_000 }), async (req, res) => {
    if (!media) return res.status(503).json({ error: 'Writing answers is not set up on the server.' });
    res.json(await readHandwriting(req.body?.strokes, media));
  });

  return router;
}

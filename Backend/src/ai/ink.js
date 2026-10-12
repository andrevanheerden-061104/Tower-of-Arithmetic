import { AppError } from '../lib/errors.js';
import { cleanMaths, spokenToMaths } from '../maths/spoken.js';
import { cleanStrokes, strokesToPng } from '../maths/sketch.js';

// ---------------------------------------------------------------------------
// Answering without the keypad: by voice ("Speak") or by writing with a
// finger ("Draw"). Both return maths written with the keypad's own keys, so
// the player sees it in their step and can fix it before casting.
// The Groq calls are passed in (`media`) so tests can use fakes.
// ---------------------------------------------------------------------------

// Words that help Whisper write maths the right way
const SPEECH_PROMPT = 'A learner says one line of maths working, for example: x squared equals 2x plus 3. x equals 7. Three quarters. 2.5. Square root of 49.';

export async function readSpeech(file, media) {
  if (!file?.buffer?.length) throw new AppError('No recording was sent.', 400);
  if (file.buffer.length > 3 * 1024 * 1024) throw new AppError('That recording is too long. Keep it under 15 seconds.', 413);
  const text = await media.transcribe({ ...file, prompt: SPEECH_PROMPT });
  return { heard: text.slice(0, 200), maths: spokenToMaths(text) };
}

const WRITING_PROMPT = `This picture is one line of a school learner's handwritten maths (a sum, an answer or a step of working, like "x = 7", "3/4" or "2x + 3 = 11").
Write exactly what is written. Do not solve it, correct it or add anything.
Use only these symbols: digits, . / ÷ × − + = ( ) ^ √ ² ³ π % ° < > ≤ ≥ and the letters x, y, n, a, b, c, m, k, t, r.
A fraction written with one number above the other is written as top/bottom (3/4). A small raised number is a power (x²).
Reply with JSON only: {"text": "what is written"}. If nothing can be read, reply {"text": ""}.`;

export async function readHandwriting(strokes, media) {
  const clean = cleanStrokes(strokes);
  if (!clean.length) throw new AppError('Write something first.', 400);
  const png = strokesToPng(clean);
  const reply = await media.readImage({ png, prompt: WRITING_PROMPT });
  let text = reply;
  const start = reply.indexOf('{');
  const end = reply.lastIndexOf('}');
  if (start !== -1 && end > start) {
    try {
      text = JSON.parse(reply.slice(start, end + 1)).text ?? '';
    } catch {
      text = reply;
    }
  }
  return { maths: cleanMaths(text) };
}

import { config } from '../config.js';
import { AppError } from './errors.js';

// ---------------------------------------------------------------------------
// The two Groq calls for answering by voice and by handwriting.
//   transcribe  speech -> text (Whisper)
//   readImage   a picture + a question -> text (a vision model)
// The model names come from config (GROQ_SPEECH_MODEL, GROQ_VISION_MODEL).
// ---------------------------------------------------------------------------

const BASE = 'https://api.groq.com/openai/v1';

async function post(path, init, timeoutMs) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(`${BASE}${path}`, {
      method: 'POST',
      signal: controller.signal,
      ...init,
      headers: { Authorization: `Bearer ${config.groqApiKey}`, ...init.headers },
    });
    if (res.status === 429) throw new AppError('The AI is busy right now. Try again in a minute.', 429);
    if (!res.ok) throw new AppError(`The AI replied with an error (${res.status}).`, 502);
    return await res.json();
  } catch (error) {
    if (error.name === 'AbortError') throw new AppError('The AI took too long to answer.', 504);
    throw error;
  } finally {
    clearTimeout(timer);
  }
}

// What was said in a short recording. `prompt` helps Whisper spell maths.
export async function transcribe({ buffer, filename, type, prompt }) {
  const form = new FormData();
  form.append('file', new Blob([buffer], { type }), filename);
  form.append('model', config.groqSpeechModel);
  form.append('language', 'en');
  form.append('temperature', '0');
  form.append('response_format', 'json');
  if (prompt) form.append('prompt', prompt);
  const data = await post('/audio/transcriptions', { body: form }, 20000);
  return String(data.text ?? '').trim();
}

// Ask a vision model about a PNG picture. Returns its reply as text.
export async function readImage({ png, prompt }) {
  const body = {
    model: config.groqVisionModel,
    temperature: 0,
    max_tokens: 1200,
    messages: [
      {
        role: 'user',
        content: [
          { type: 'text', text: prompt },
          { type: 'image_url', image_url: { url: `data:image/png;base64,${png.toString('base64')}` } },
        ],
      },
    ],
  };
  const data = await post('/chat/completions', { headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }, 30000);
  // Some models think out loud first: keep only the answer
  return String(data.choices?.[0]?.message?.content ?? '')
    .replace(/<think>[\s\S]*?<\/think>/g, '')
    .trim();
}

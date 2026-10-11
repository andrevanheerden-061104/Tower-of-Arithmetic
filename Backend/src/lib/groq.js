import { config } from '../config.js';
import { AppError } from './errors.js';

const URL = 'https://api.groq.com/openai/v1/chat/completions';


// Ask Groq for a JSON answer. Tries twice if the reply isn't usable, and
// gives up after `timeoutMs`. `send` can be swapped out in the tests.
export async function askForJson({ system, user, temperature = 0.7, maxTokens = 3000, timeoutMs = 30000, send = callGroq }) {
  let lastError;
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const text = await send({ system, user, temperature, maxTokens, timeoutMs });
      return parseJson(text);
    } catch (error) {
      lastError = error;
      if (error.status === 429) break; // rate limited: trying again won't help
    }
  }
  throw lastError;
}

async function callGroq({ system, user, temperature, maxTokens, timeoutMs }) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const body = {
      model: config.groqModel,
      temperature,
      max_tokens: maxTokens,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user },
      ],
    };
    // The gpt-oss models think before answering; keep that short and quick
    if (config.groqModel.startsWith('openai/gpt-oss')) body.reasoning_effort = 'low';

    const res = await fetch(URL, {
      method: 'POST',
      signal: controller.signal,
      headers: { Authorization: `Bearer ${config.groqApiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (res.status === 429) throw new AppError('The AI is busy right now. Try again in a minute.', 429);
    if (!res.ok) throw new AppError(`The AI replied with an error (${res.status}).`);
    const data = await res.json();
    return data.choices?.[0]?.message?.content ?? '';
  } catch (error) {
    if (error.name === 'AbortError') throw new AppError('The AI took too long to answer.', 504);
    throw error;
  } finally {
    clearTimeout(timer);
  }
}

// Models sometimes wrap the JSON in ``` fences or add a sentence: find the object.
export function parseJson(text) {
  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');
  if (start === -1 || end <= start) throw new AppError('The AI reply had no JSON in it.');
  try {
    return JSON.parse(text.slice(start, end + 1));
  } catch {
    throw new AppError('The AI reply was not valid JSON.');
  }
}

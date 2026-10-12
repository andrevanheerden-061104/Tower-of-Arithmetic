import { Platform } from 'react-native';
import { apiPost, apiUpload, apiUploadFile } from '../lib/api';
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

// --- answering by voice and by handwriting -----------------------------------
// These two show their error to the player (e.g. "Can't reach the game
// server"), so they throw instead of returning null.

const AUDIO_TYPES = { m4a: 'audio/mp4', mp4: 'audio/mp4', webm: 'audio/webm', wav: 'audio/wav', ogg: 'audio/ogg', mp3: 'audio/mpeg', caf: 'audio/x-caf', '3gp': 'audio/3gpp' };

// A recording (its file address on the phone) -> { heard, maths }
export async function readSpokenAnswer(uri) {
  if (Platform.OS === 'web') {
    const blob = await (await fetch(uri)).blob();
    const ext = blob.type.includes('mp4') ? 'm4a' : blob.type.includes('ogg') ? 'ogg' : 'webm';
    return apiUpload('/api/speech', formWith(blob, `speech.${ext}`));
  }
  const found = /\.([a-z0-9]+)(?:\?.*)?$/i.exec(uri)?.[1]?.toLowerCase();
  const ext = AUDIO_TYPES[found] ? found : 'm4a';
  // Android needs the file:// in front of the path to send the file
  const fileUri = /^[a-z]+:\/\//i.test(uri) ? uri : `file://${uri}`;
  return apiUploadFile('/api/speech', { uri: fileUri, name: `speech.${ext}`, type: AUDIO_TYPES[ext] });
}

function formWith(file, name) {
  const form = new FormData();
  if (name) form.append('file', file, name);
  else form.append('file', file);
  return form;
}

// Pen strokes ([[x, y, x, y, ...], ...]) -> { maths }
export function readWrittenAnswer(strokes) {
  return apiPost('/api/handwriting', { strokes }, { timeoutMs: 40000 });
}

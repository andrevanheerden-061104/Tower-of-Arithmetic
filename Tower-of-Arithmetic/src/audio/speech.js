import * as Speech from 'expo-speech';
import { duckMusic } from './music';
import { stopVoice } from './voice';

// ---------------------------------------------------------------------------
// Read aloud
//
// Reads text out with the phone's own voice (expo-speech; the browser's
// voice on the web). The speaker buttons call speak(); with the Read aloud
// setting on (setReadAloud, from App.js) each new sum is also read out by
// itself when it appears (useReadAloud). The music is turned down while
// it talks. Maths symbols are said as words: "3 + ? = 7" becomes
// "3 plus what equals 7?".
// ---------------------------------------------------------------------------

let auto = false;

// The Read aloud setting
export function setReadAloud(on) {
  auto = Boolean(on);
  if (!auto) stopSpeaking();
}

export function readAloudOn() {
  return auto;
}

const SUBSCRIPTS = { '₀': '0', '₁': '1', '₂': '2', '₃': '3', '₄': '4', '₅': '5', '₆': '6', '₇': '7', '₈': '8', '₉': '9', 'ₙ': 'n' };
const SUPERSCRIPTS = { '²': ' squared', '³': ' cubed', '⁴': ' to the power 4', '⁵': ' to the power 5', '⁶': ' to the power 6', '⁷': ' to the power 7', '⁸': ' to the power 8', '⁹': ' to the power 9' };

const PARTS = { 2: 'half', 3: 'third', 4: 'quarter', 5: 'fifth', 6: 'sixth', 7: 'seventh', 8: 'eighth', 9: 'ninth', 10: 'tenth', 11: 'eleventh', 12: 'twelfth' };

// 3/4 → "3 quarters", 1/2 → "1 half"; other fractions are "a over b"
function fractionWords(top, bottom) {
  const part = PARTS[bottom];
  if (!part) return `${top} over ${bottom}`;
  if (top === 1) return `1 ${part}`;
  return `${top} ${bottom === 2 ? 'halves' : `${part}s`}`;
}

// Maths written for the eye, turned into words for the ear
export function spokenMaths(text) {
  return String(text ?? '')
    .replace(/[₀-₉ₙ]+/g, (run) => ` ${[...run].map((c) => SUBSCRIPTS[c]).join('')}`)
    .replace(/[²³⁴-⁹]/g, (c) => SUPERSCRIPTS[c])
    .replace(/cm²|cm squared/g, 'square centimetres')
    .replace(/m squared/g, 'square metres')
    .replace(/cm³|cm cubed/g, 'cubic centimetres')
    .replace(/√\(?(\d+)\)?/g, 'the square root of $1')
    .replace(/\^\(([^)]+)\)/g, ' to the power of $1,')
    .replace(/\^(\S+)/g, ' to the power $1')
    .replace(/(\d+)\/(\d+)/g, (m, top, bottom) => fractionWords(Number(top), Number(bottom)))
    .replace(/([a-z])\/(\d+)/g, '$1 over $2')
    .replace(/(^|[\s(])[−-](\d)/g, '$1negative $2')
    .replace(/\s[−-]\s/g, ' minus ')
    .replace(/\s?\+\s?/g, ' plus ')
    .replace(/\s?×\s?/g, ' times ')
    .replace(/\s?÷\s?/g, ' divided by ')
    .replace(/\s?=\s?/g, ' equals ')
    .replace(/\s?→\s?/g, ' gives ')
    .replace(/(\d)\s?%/g, '$1 percent')
    .replace(/(\d)\s?°/g, '$1 degrees')
    .replace(/,?\s*…/g, ', and so on,')
    .replace(/·/g, '.')
    .replace(/\?/g, ' what ')
    .replace(/\s+([,.!])/g, '$1')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

// The words to read for a sum: its story, the instruction, then the sum
export function questionWords(question, before) {
  if (!question) return before ?? '';
  const said = spokenMaths(question.display);
  const sum = said ? `${said}${/what/.test(said) ? '?' : '.'}` : null;
  return [before, question.story, question.instruction, sum]
    .filter(Boolean)
    .map((part) => String(part).trim().replace(/[^.?!]$/, '$&.'))
    .join(' ');
}

let speaking = false;

export function stopSpeaking() {
  try {
    Speech.stop();
  } catch {
    // ignore
  }
  if (speaking) duckMusic(false);
  speaking = false;
}

// Read `text` out loud (stops anything already being read). `slow` is
// for the youngest players.
export function speak(text, { slow = false } = {}) {
  const words = String(text ?? '').trim();
  if (!words) return;
  stopSpeaking();
  stopVoice(); // never talk over Orrin
  speaking = true;
  duckMusic(true);
  const done = () => {
    if (!speaking) return;
    speaking = false;
    duckMusic(false);
  };
  try {
    Speech.speak(words, { rate: slow ? 0.8 : 0.92, pitch: 1.05, onDone: done, onStopped: done, onError: done });
  } catch {
    done();
  }
}

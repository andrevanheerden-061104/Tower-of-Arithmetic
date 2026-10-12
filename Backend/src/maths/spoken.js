// ---------------------------------------------------------------------------
// Turning words into maths the keypad can show.
//
//   spokenToMaths('x squared equals two x plus three')  -> 'x² = 2x+3'
//   spokenToMaths('three quarters')                     -> '3/4'
//   cleanMaths('X^2 = 2*x - 3')                          -> 'x^2 = 2x−3'
//
// Speech comes back from Whisper as words ("x equals seven") or already as
// symbols ("x = 7"); both end up the same. Anything that isn't maths
// ("um, I think the answer is") is dropped. The result only uses keys that
// are on the game's keypads, so the player can fix it with the keypad.
// ---------------------------------------------------------------------------

// Every character a step of working can use (both keypad pages).
export const MATHS_CHARS = '0123456789.,/÷×−+=()[]^xnyabcmktr√²³π%°<>≤≥±∴:';

const UNITS = {
  zero: 0, oh: 0, nought: 0, one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9,
  ten: 10, eleven: 11, twelve: 12, thirteen: 13, fourteen: 14, fifteen: 15, sixteen: 16, seventeen: 17,
  eighteen: 18, nineteen: 19,
};
const TENS = { twenty: 20, thirty: 30, forty: 40, fourty: 40, fifty: 50, sixty: 60, seventy: 70, eighty: 80, ninety: 90 };
const SCALES = { hundred: 100, thousand: 1000, million: 1000000 };
const isNumberWord = (w) => w in UNITS || w in TENS || w in SCALES;

// "one hundred and five" -> 105, "twenty one" -> 21. Two small numbers in a
// row ("five six", after "point") stay separate: 5 6.
function wordsToNumbers(words) {
  const out = [];
  let i = 0;
  while (i < words.length) {
    if (!isNumberWord(words[i])) {
      out.push(words[i]);
      i += 1;
      continue;
    }
    let total = 0;
    let current = 0;
    let last = null; // 'unit' | 'tens' | 'scale'
    while (i < words.length) {
      const w = words[i];
      if (w === 'and' && last === 'scale' && i + 1 < words.length && (words[i + 1] in UNITS || words[i + 1] in TENS)) {
        i += 1;
        continue;
      }
      if (w in UNITS) {
        if (last === 'unit' || (last === 'tens' && UNITS[w] >= 10) || (last === 'tens' && UNITS[w] === 0)) break;
        current += UNITS[w];
        last = 'unit';
      } else if (w in TENS) {
        if (last === 'unit' || last === 'tens') break;
        current += TENS[w];
        last = 'tens';
      } else if (w in SCALES) {
        if (last === null) current = 1;
        if (SCALES[w] === 100) current *= 100;
        else {
          total += current * SCALES[w];
          current = 0;
        }
        last = 'scale';
      } else break;
      i += 1;
    }
    out.push(String(total + current));
  }
  return out;
}

const ORDINAL_POWERS = { second: 2, third: 3, fourth: 4, fifth: 5, sixth: 6 };
const DENOMINATORS = {
  half: 2, halves: 2, third: 3, thirds: 3, quarter: 4, quarters: 4, fourth: 4, fourths: 4, fifth: 5, fifths: 5,
  sixth: 6, sixths: 6, seventh: 7, sevenths: 7, eighth: 8, eighths: 8, ninth: 9, ninths: 9, tenth: 10, tenths: 10,
  hundredth: 100, hundredths: 100,
};

// Longest phrases first, so "plus or minus" wins over "plus".
const PHRASES = [
  [/\bless than or equal to\b/g, ' ≤ '],
  [/\b(greater|more) than or equal to\b/g, ' ≥ '],
  [/\bless than\b/g, ' < '],
  [/\b(greater|more) than\b/g, ' > '],
  [/\bplus or minus\b/g, ' ± '],
  [/\b(is equal to|equals|equal to|equal|is the same as|makes|gives)\b/g, ' = '],
  [/\b(raised )?to the power( of)?\b/g, ' ^ '],
  [/\bsquared\b/g, ' ² '],
  [/\bcubed\b/g, ' ³ '],
  [/\b(the )?square root( of)?\b/g, ' √ '],
  [/\broot of\b/g, ' √ '],
  [/\b(multiplied by|multiply by|times|multiplied|multiply)\b/g, ' × '],
  [/\b(divided by|divide by|divided|shared by)\b/g, ' ÷ '],
  [/\b(over|out of)\b/g, ' / '],
  [/\b(plus|add)\b/g, ' + '],
  [/\b(minus|take away|subtract|negative)\b/g, ' − '],
  [/\b(open|left) (bracket|brackets|parenthesis)\b|\bbracket open\b/g, ' ( '],
  [/\b(close|closed|right) (bracket|brackets|parenthesis)\b|\bbracket close\b/g, ' ) '],
  [/\b(per cent|percent|percentage)\b/g, ' % '],
  [/\bdegrees?\b/g, ' ° '],
  [/\bpie?\b/g, ' π '],
  [/\btherefore\b/g, ' ∴ '],
  [/\b(point|dot|comma)\b/g, ' . '],
  [/\bex\b/g, ' x '],
  [/\bwhy\b/g, ' y '],
  [/\bis(?=\s*[<>≤≥])/g, ' '], // "y is less than 4"
  [/\bis\b/g, ' = '],
];

// A word that is maths: a number, a symbol, or numbers and symbols with at
// most one letter ("2x", "x²", "3n"). Ordinary words ("cat") are dropped.
function isMathsToken(token) {
  if (!token) return false;
  if ([...token].some((c) => !MATHS_CHARS.includes(c))) return false;
  const letters = token.replace(/[^a-z]/g, '');
  return letters.length <= 1;
}

// Plain keyboard symbols -> the keypad's own ones.
function toKeypadSymbols(text) {
  return text
    .replace(/[*∗·]/g, '×')
    .replace(/[-–—]/g, '−')
    .replace(/[⁄∕]/g, '/')
    .replace(/<=/g, '≤')
    .replace(/>=/g, '≥')
    .replace(/\+\/−/g, '±')
    .replace(/sqrt/g, '√')
    .replace(/\bpi\b/g, 'π');
}

// Join the pieces the way the keypad writes them: no spaces, except
// " = " around equals signs.
function tidy(tokens) {
  const parts = tokens.join('').replace(/=+/g, '=').split('=').map((part) => part.trim());
  while (parts.length > 1 && !parts[0]) parts.shift(); // "the answer is 7" -> "7"
  return parts.join(' = ').trim().slice(0, 60);
}

export function spokenToMaths(text) {
  if (!text) return '';
  let s = ` ${String(text).toLowerCase()} `
    .replace(/[’‘]/g, "'")
    .replace(/(\d),(\d{3})\b/g, '$1$2') // 1,000 -> 1000
    .replace(/(\d)\.(?=\d)/g, '$1DOT') // keep 2.5 safe from the full stops below
    .replace(/[?!"]/g, ' ')
    .replace(/\.(\s|$)/g, ' ')
    .replace(/DOT/g, '.');
  s = toKeypadSymbols(s);

  // "to the fourth (power)" -> ^4
  s = s.replace(/\bto the (second|third|fourth|fifth|sixth)( power)?\b/g, (_, w) => ` ^ ${ORDINAL_POWERS[w]} `);
  for (const [pattern, symbol] of PHRASES) s = s.replace(pattern, symbol);
  // Put a space between numbers and symbols that came out stuck together
  s = s.replace(/([=()÷×−+^√²³%°<>≤≥±∴])/g, ' $1 ');

  let words = s.split(/\s+/).filter(Boolean);
  words = wordsToNumbers(words.filter((w) => w !== 'a' && w !== 'an'));

  // Fractions said as words: "3 quarters" -> 3/4, "a half" -> 1/2
  const out = [];
  for (let i = 0; i < words.length; i++) {
    const w = words[i];
    if (w in DENOMINATORS) {
      const prev = out.at(-1);
      if (prev && /^\d+$/.test(prev)) out[out.length - 1] = `${prev}/${DENOMINATORS[w]}`;
      else out.push(`1/${DENOMINATORS[w]}`);
      continue;
    }
    out.push(w);
  }
  return tidy(out.filter(isMathsToken));
}

// Text read from handwriting (or typed by a model): keep only keypad
// characters, written the keypad's way.
export function cleanMaths(text) {
  if (!text) return '';
  const s = toKeypadSymbols(String(text).replace(/\\times/g, '×').replace(/\\div/g, '÷').replace(/\\sqrt/g, '√').replace(/\\pi/g, 'π'))
    .replace(/X/g, 'x')
    .replace(/[A-Z]/g, (c) => c.toLowerCase());
  return tidy([...s].filter((c) => MATHS_CHARS.includes(c)));
}

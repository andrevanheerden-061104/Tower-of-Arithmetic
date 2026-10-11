"""Work out when each word of the tutorial's voice lines is spoken.

The tutorial lights up each word as Orrin says it. The recordings have no
word timings, so this script finds the pauses in each recording (ffmpeg's
silencedetect), matches them to the punctuation in the line's text, and
spreads the words of each phrase over the time it takes.

Run it from the project folder after adding or changing a recording or its
text in src/data/tutorialSteps.js:

    python scripts/voice-timings.py

Needs Python 3 and ffmpeg. Writes src/data/tutorialVoiceTimings.js.
"""
import json
import os
import re
import subprocess

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
STEPS = os.path.join(ROOT, 'src', 'data', 'tutorialSteps.js')
OUT = os.path.join(ROOT, 'src', 'data', 'tutorialVoiceTimings.js')

source = open(STEPS, encoding='utf-8').read()
files = dict(re.findall(r"(\w+): require\('\.\./(assets/[^']+\.mp3)'\)", source))
texts = dict(re.findall(r"voice: '(\w+)',\s*text: \"((?:[^\"\\]|\\.)*)\"", source))


def speech_parts(path):
    """(start, end) of each stretch of speech, in seconds."""
    duration = float(subprocess.run(
        ['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', path],
        capture_output=True, text=True, check=True).stdout.strip())
    log = subprocess.run(
        ['ffmpeg', '-hide_banner', '-nostats', '-i', path, '-af', 'silencedetect=noise=-35dB:d=0.12', '-f', 'null', '-'],
        capture_output=True, text=True).stderr
    marks = re.findall(r'silence_(start|end): ([0-9.]+)', log)
    silences, start = [], None
    for kind, value in marks:
        if kind == 'start':
            start = float(value)
        else:
            silences.append((start, float(value)))
            start = None
    if start is not None:
        silences.append((start, duration))
    parts, t = [], 0.0
    for a, b in silences:
        if a - t > 0.05:
            parts.append((t, a))
        t = b
    if duration - t > 0.05:
        parts.append((t, duration))
    return parts


def word_starts(text, parts):
    words = text.split(' ')
    weight = lambda idx: sum(len(re.sub(r'[^\w]', '', words[i])) + 1 for i in idx)
    # Phrases end at punctuation
    phrases, phrase = [], []
    for i, word in enumerate(words):
        phrase.append(i)
        if re.search(r'[,.!?:;…]$', word):
            phrases.append(phrase)
            phrase = []
    if phrase:
        phrases.append(phrase)
    # Make the number of pauses and phrases match
    while len(parts) > len(phrases):  # extra pauses: join the closest parts
        gaps = [parts[i + 1][0] - parts[i][1] for i in range(len(parts) - 1)]
        j = gaps.index(min(gaps))
        parts[j:j + 2] = [(parts[j][0], parts[j + 1][1])]
    while len(phrases) > len(parts):  # missing pauses: join the shortest phrases
        j = min(range(len(phrases) - 1), key=lambda i: weight(phrases[i]) + weight(phrases[i + 1]))
        phrases[j:j + 2] = [phrases[j] + phrases[j + 1]]
    starts = [0.0] * len(words)
    for (a, b), idx in zip(parts, phrases):
        total, t = weight(idx), a
        for i in idx:
            starts[i] = round(t, 2)
            t += (b - a) * weight([i]) / total
    return starts


timings = {}
for name, text in texts.items():
    if name not in files:
        print('no recording for', name)
        continue
    path = os.path.join(ROOT, 'src', files[name].replace('/', os.sep))
    timings[name] = word_starts(json.loads('"' + text + '"'), speech_parts(path))
    print(name, 'ok')

with open(OUT, 'w', encoding='utf-8', newline='\r\n') as f:
    f.write('// Made by scripts/voice-timings.py: do not edit by hand.\n')
    f.write('// When each word of each tutorial voice line starts, in seconds.\n')
    f.write('export const TIMINGS = {\n')
    for name in sorted(timings):
        f.write(f'  {name}: {json.dumps(timings[name])},\n')
    f.write('};\n')
print('wrote', OUT)

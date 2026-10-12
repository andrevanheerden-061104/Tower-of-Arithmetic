import { test } from 'node:test';
import assert from 'node:assert/strict';
import { inflateSync } from 'node:zlib';
import { readHandwriting, readSpeech } from '../src/ai/ink.js';
import { fileFromMultipart } from '../src/lib/multipart.js';
import { cleanMaths, spokenToMaths } from '../src/maths/spoken.js';
import { cleanStrokes, strokesToPng } from '../src/maths/sketch.js';

test('spoken maths becomes keypad maths', () => {
  const cases = [
    ['x squared equals two x plus three', 'x² = 2x+3'],
    ['X equals 7.', 'x = 7'],
    ['The answer is three quarters', '3/4'],
    ['two point five', '2.5'],
    ['one hundred and five', '105'],
    ['twenty one times four', '21×4'],
    ['x² = 2x + 3', 'x² = 2x+3'],
    ['negative three', '−3'],
    ['square root of forty nine', '√49'],
    ['open bracket x plus two close bracket squared', '(x+2)²'],
    ['3x minus 4 equals 11', '3x−4 = 11'],
    ['um I think it is a half', '1/2'],
    ['x to the power of three', 'x^3'],
    ['three over four', '3/4'],
    ['x equals 1,000', 'x = 1000'],
    ['two thousand three hundred and forty', '2340'],
    ['n equals five', 'n = 5'],
    ['fifty percent', '50%'],
    ['3 - 4 * 2', '3−4×2'],
    ['the cat sat', ''],
  ];
  for (const [said, want] of cases) assert.equal(spokenToMaths(said), want, said);
});

test('model text is tidied to keypad keys', () => {
  assert.equal(cleanMaths('X^2 = 2x - 3'), 'x^2 = 2x−3');
  assert.equal(cleanMaths('$x = \\sqrt{49}$'), 'x = √49');
  assert.equal(cleanMaths(''), '');
});

test('strokes are drawn as a real PNG', () => {
  const strokes = cleanStrokes([[10, 10, 40, 60, 70, 10], [5, 'bad', 6], 'nope', [100, 100]]);
  assert.equal(strokes.length, 3);
  const png = strokesToPng(strokes);
  assert.deepEqual([...png.subarray(0, 8)], [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  const width = png.readUInt32BE(16);
  const height = png.readUInt32BE(20);
  assert.ok(width > 48 && width <= 900 && height > 48 && height <= 320);
  // The pixels unpack to the right size and some of them are ink
  const start = png.indexOf('IDAT') + 4;
  const length = png.readUInt32BE(start - 8);
  const rows = inflateSync(png.subarray(start, start + length));
  assert.equal(rows.length, (width + 1) * height);
  assert.ok(rows.includes(0));
});

test('the recording is found in a multipart upload', () => {
  const boundary = 'XyZ';
  const body = Buffer.concat([
    Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="file"; filename="a.m4a"\r\nContent-Type: audio/mp4\r\n\r\n`),
    Buffer.from([1, 2, 3, 13, 10, 4]),
    Buffer.from(`\r\n--${boundary}--\r\n`),
  ]);
  const file = fileFromMultipart(body, `multipart/form-data; boundary=${boundary}`);
  assert.deepEqual([...file.buffer], [1, 2, 3, 13, 10, 4]);
  assert.equal(file.filename, 'a.m4a');
  assert.equal(file.type, 'audio/mp4');
  assert.equal(fileFromMultipart(body, 'application/json'), null);
});

test('speech and handwriting use the AI and return keypad maths', async () => {
  const media = {
    transcribe: async () => 'x equals seven',
    readImage: async ({ png }) => {
      assert.ok(Buffer.isBuffer(png));
      return '<think>hmm</think>{"text": "2x + 3 = 11"}';
    },
  };
  assert.deepEqual(await readSpeech({ buffer: Buffer.from([1]), filename: 'a.m4a', type: 'audio/mp4' }, media), { heard: 'x equals seven', maths: 'x = 7' });
  assert.deepEqual(await readHandwriting([[0, 0, 10, 10]], media), { maths: '2x+3 = 11' });
  await assert.rejects(readHandwriting([], media), /Write something/);
  await assert.rejects(readSpeech({ buffer: Buffer.alloc(0) }, media), /No recording/);
});

test('the speech and handwriting routes work through the server', async () => {
  const { createApp } = await import('../src/app.js');
  const app = createApp({
    userFromToken: async (token) => (token === 'good' ? { id: 'u1' } : null),
    ask: async () => ({}),
    media: {
      transcribe: async ({ buffer, type }) => (buffer.length === 3 && type.startsWith('audio/') ? 'three quarters' : 'wrong'),
      readImage: async () => '{"text": "x = 7"}',
    },
  });
  const server = app.listen(0);
  const base = `http://127.0.0.1:${server.address().port}`;
  const auth = { Authorization: 'Bearer good' };
  try {
    const form = new FormData();
    form.append('file', new Blob([new Uint8Array([1, 2, 3])], { type: 'audio/mp4' }), 'speech.m4a');
    const spoken = await fetch(`${base}/api/speech`, { method: 'POST', headers: auth, body: form });
    assert.deepEqual(await spoken.json(), { heard: 'three quarters', maths: '3/4' });

    // A long stroke list is still accepted (bigger body limit for this route)
    const strokes = Array.from({ length: 40 }, (_, i) => Array.from({ length: 200 }, (_, j) => (i * 7 + j) % 300));
    const written = await fetch(`${base}/api/handwriting`, { method: 'POST', headers: { ...auth, 'Content-Type': 'application/json' }, body: JSON.stringify({ strokes }) });
    assert.deepEqual(await written.json(), { maths: 'x = 7' });

    const empty = await fetch(`${base}/api/handwriting`, { method: 'POST', headers: { ...auth, 'Content-Type': 'application/json' }, body: '{"strokes": []}' });
    assert.equal(empty.status, 400);
  } finally {
    server.close();
  }
});

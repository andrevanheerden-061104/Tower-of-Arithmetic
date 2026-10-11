import { test } from 'node:test';
import assert from 'node:assert/strict';

// Runs the real server with a fake login check and a fake AI.
// (Skipped until `npm install` has been run.)
let createApp = null;
try {
  ({ createApp } = await import('../src/app.js'));
} catch {
  createApp = null;
}

test('API answers with fake login and fake AI', { skip: !createApp && 'run npm install first' }, async () => {
  const app = createApp({
    userFromToken: async (token) => (token === 'good' ? { id: 'u1' } : null),
    ask: async () => ({ hint: 'Did you add 4 to both sides?' }),
  });
  const server = app.listen(0);
  const base = `http://127.0.0.1:${server.address().port}`;
  try {
    assert.deepEqual(await (await fetch(`${base}/health`)).json(), { ok: true });

    const noLogin = await fetch(`${base}/api/hint`, { method: 'POST' });
    assert.equal(noLogin.status, 401);

    const res = await fetch(`${base}/api/hint`, {
      method: 'POST',
      headers: { Authorization: 'Bearer good', 'Content-Type': 'application/json' },
      body: JSON.stringify({ version: 'senior', question: { display: '2x − 4 = 10', answer: 'x=7' }, givenAnswer: 'x=3' }),
    });
    assert.equal(res.status, 200);
    assert.deepEqual(await res.json(), { hint: 'Did you add 4 to both sides?' });

    const bad = await fetch(`${base}/api/questions`, {
      method: 'POST',
      headers: { Authorization: 'Bearer good', 'Content-Type': 'application/json' },
      body: JSON.stringify({ version: 'wizard' }),
    });
    assert.equal(bad.status, 400);
  } finally {
    server.close();
  }
});

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { givesAway, makeHint } from '../src/ai/hints.js';
import { cleanQuestion, juniorPicture, makeQuestions } from '../src/ai/questions.js';
import { makeSummary } from '../src/ai/summary.js';

const good = {
  topic: 'algebra',
  instruction: 'Solve for x · show each step',
  display: '2x − 4 = 10',
  answer: 'x = 7',
  check: '2x − 4 = 10',
  steps: ['2x = 10 + 4', '2x = 14', 'x = 7'],
  accepted: ['7', 'x=8'],
  hints: ['What can you do to both sides to remove the − 4?', 'Add 4 to both sides.', 'Now divide both sides by 2.'],
};

test('keeps a correct senior question in the game format', () => {
  const q = cleanQuestion(good, 'senior', ['algebra']);
  assert.equal(q.type, 'algebra');
  assert.equal(q.answer, 'x=7');
  assert.deepEqual(q.accepted, ['x=7', '7']); // the wrong "x=8" is dropped
  assert.equal(q.steps.length, 3);
});

test('throws away questions whose maths is wrong or incomplete', () => {
  assert.equal(cleanQuestion({ ...good, answer: 'x=8' }, 'senior', ['algebra']), null);
  assert.equal(cleanQuestion({ ...good, check: 'nonsense' }, 'senior', ['algebra']), null);
  assert.equal(cleanQuestion({ ...good, hints: ['one'] }, 'senior', ['algebra']), null);
  assert.equal(cleanQuestion({ ...good, topic: 'geometry' }, 'senior', ['algebra']), null);
  assert.equal(cleanQuestion({ ...good, steps: [] }, 'senior', ['algebra']), null);
});

test('junior questions need three choices including the answer, and get dots', () => {
  const jr = { topic: 'adding', instruction: 'How many altogether?', display: '7 + 5 = ?', answer: '12', check: '7 + 5 = ?', choices: ['11', '12', '13'], hints: ['a', 'b', 'c'] };
  const q = cleanQuestion(jr, 'junior', ['adding']);
  assert.deepEqual(q.picture, { kind: 'dots', groups: [{ count: 7, color: 'gold' }, { count: 5, color: 'pink' }] });
  assert.equal(cleanQuestion({ ...jr, choices: ['11', '13', '14'] }, 'junior', ['adding']), null);
  assert.deepEqual(juniorPicture('9 − 3 = ?'), { kind: 'takeAway', total: 9, gone: 3 });
  assert.deepEqual(juniorPicture('3 × 2 = ?'), { kind: 'groups', groups: 3, each: 2 });
});

test('makeQuestions groups good questions by topic and counts the rejects', async () => {
  let asked;
  const ask = async (prompt) => {
    asked = prompt;
    return { questions: [good, { ...good, display: '3x + 2 = 11', check: '3x + 2 = 11', answer: 'x=3' }, { ...good, answer: 'x=9' }, good] };
  };
  const { questions, rejected } = await makeQuestions({ version: 'senior', topics: ['algebra', 'nonsense'], perTopic: 2, floor: 3, floors: 10 }, ask);
  assert.equal(questions.algebra.length, 2); // the duplicate is dropped too
  assert.equal(rejected, 1);
  assert.match(asked.user, /floor 3 of 10/);
  assert.match(asked.system, /Grades 7 to 11/);
  await assert.rejects(makeQuestions({ version: 'wizard' }, ask), /Unknown version/);
});

test('hints never give the answer away', async () => {
  assert.ok(givesAway('So x = 7, well done', 'x=7'));
  assert.ok(!givesAway('Try adding 4 to both sides first. What is 10 + 4?', 'x=7'));
  assert.ok(!givesAway('There are 17 orbs', '7'));
  const q = { display: '2x − 4 = 10', answer: 'x=7' };
  assert.equal(await makeHint({ version: 'senior', question: q, givenAnswer: 'x=3' }, async () => ({ hint: 'x is 7!' })), null);
  assert.equal(
    await makeHint({ version: 'senior', question: q, givenAnswer: 'x=3' }, async () => ({ hint: 'Did you add 4 to both sides?' })),
    'Did you add 4 to both sides?',
  );
});

test('run summary only uses the numbers sent', async () => {
  let sent;
  const result = await makeSummary(
    { version: 'senior', won: false, floorsCleared: 4, floors: 10, topics: [{ topic: 'algebra', attempts: 6, correct: 5, timeMs: 60000, hints: 1 }, { topic: 'x', attempts: 0 }] },
    async (p) => {
      sent = p.user;
      return { summary: 'Great algebra!', focusTopic: 'algebra' };
    },
  );
  assert.deepEqual(result, { summary: 'Great algebra!', focusTopic: 'algebra' });
  assert.match(sent, /algebra: 6 tried, 5 correct, 10s each, 1 hints/);
  assert.doesNotMatch(sent, /x: /);
});

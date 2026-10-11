import { test } from 'node:test';
import assert from 'node:assert/strict';
import { examplesOf, GUIDE, gradeFor } from '../src/ai/curriculum.js';
import { givesAway, makeHint } from '../src/ai/hints.js';
import { answerForm, cleanQuestion, juniorPicture, makeQuestions } from '../src/ai/questions.js';
import { makeSummary, runFacts, cleanStats } from '../src/ai/summary.js';
import { onTopic } from '../src/ai/topics.js';
import { solveQuestion } from '../src/maths/solve.js';

const senior = { version: 'senior', grade: 8, topics: ['algebra'] };
const good = {
  topic: 'algebra',
  level: 2,
  instruction: 'Solve for x · show each step',
  display: '2x − 4 = 3x − 11',
  answer: 'x = 7',
  steps: ['2x − 3x = −11 + 4', '−x = −7', 'x = 7'],
  hints: ['Collect the x terms on one side.', 'Subtract 3x from both sides.', 'Now divide both sides by −1.'],
};

test('keeps a correct senior question in the game format', () => {
  const q = cleanQuestion(good, senior);
  assert.equal(q.type, 'algebra');
  assert.equal(q.level, 2);
  assert.equal(q.answer, 'x=7');
  assert.deepEqual(q.accepted, ['x=7', '7', '=7']);
  assert.equal(q.steps.length, 3);
});

test('throws away questions that are wrong, off topic, untypeable or incomplete', () => {
  const reason = (raw, ctx = senior) => {
    let why = null;
    assert.equal(cleanQuestion(raw, ctx, (r) => ((why = r), null)), null);
    return why;
  };
  assert.match(reason({ ...good, answer: 'x=8' }), /wrong answer/);
  assert.match(reason({ ...good, display: 'Solve the riddle of the door' }), /not on topic/);
  assert.match(reason({ ...good, display: '3/4 + 1/8 = ?', answer: '7/8' }), /not on topic/); // fractions in an algebra dungeon
  assert.match(reason({ ...good, topic: 'geometry' }), /wrong topic/);
  assert.match(reason({ ...good, level: 5 }), /wrong topic or level/);
  assert.match(reason({ ...good, hints: ['one'] }), /missing/);
  assert.match(reason({ ...good, steps: [] }), /no worked steps/);
  assert.match(reason({ ...good, display: '5x + 1 = x + 25', answer: 'x=6' }), /copied an example/);
  // Two answers and the question doesn't say which: not fair to ask
  assert.match(reason({ ...good, display: 'x² = 49', answer: 'x=7' }), /cannot be checked/);
  assert.ok(cleanQuestion({ ...good, instruction: 'Solve for x, where x > 0', display: 'x² = 49', answer: 'x=7' }, senior));
});

test('an answer that cannot be typed on the keypad is thrown away', () => {
  // The bug that was reported: a mean of 10.5 with no decimal point to type
  const mean = { topic: 'data', level: 2, instruction: 'Find the mean', display: 'Mean of 9, 12, 10, 11', answer: '10.5', steps: ['sum = 42', '42 ÷ 4 = 10.5'], hints: ['a', 'b', 'c'] };
  let why;
  assert.equal(cleanQuestion(mean, { version: 'senior', grade: 8, topics: ['data'] }, (r) => ((why = r), null)), null);
  assert.match(why, /cannot be typed/);

  assert.equal(answerForm('type', '10.5'), null);
  assert.equal(answerForm('type', '10.5', { decimals: true }), '10.5');
  assert.equal(answerForm('type', '6/8'), '3/4'); // simplified for the learner
  assert.equal(answerForm('type', '-4'), null); // no minus key in Grades 4-6
  assert.equal(answerForm('steps', '−4'), '-4');
  assert.equal(answerForm('steps', 'x = −2'), 'x=-2');
  assert.equal(answerForm('steps', 'n = 15'), '15');
  assert.equal(answerForm('steps', 'x = 2 or x = −3'), null);
  assert.equal(answerForm('steps', '2√3'), null);
  assert.equal(answerForm('tap', '12'), '12');
  assert.equal(answerForm('tap', '1/2'), null);
});

test('junior questions get three choices and dots, even if the AI forgets them', () => {
  const jr = { topic: 'adding', level: 2, instruction: 'How many altogether?', display: '7 + 5 = ?', answer: '12', choices: ['11', '12', '13'], hints: ['a', 'b', 'c'] };
  const ctx = { version: 'junior', grade: 1, topics: ['adding'] };
  const q = cleanQuestion(jr, ctx);
  assert.deepEqual(q.choices, ['11', '12', '13']);
  assert.deepEqual(q.picture, { kind: 'dots', groups: [{ count: 7, color: 'gold' }, { count: 5, color: 'pink' }] });
  const fixed = cleanQuestion({ ...jr, choices: ['11', '13', '14'] }, ctx);
  assert.equal(fixed.choices.length, 3);
  assert.ok(fixed.choices.includes('12'));
  assert.equal(cleanQuestion({ ...jr, answer: '13' }, ctx), null);
  assert.equal(cleanQuestion({ ...jr, display: '7 − 5 = ?', answer: '2' }, ctx), null); // taking away in an adding dungeon
  assert.deepEqual(juniorPicture('9 − 3 = ?'), { kind: 'takeAway', total: 9, gone: 3 });
  assert.deepEqual(juniorPicture('3 × 2 = ?'), { kind: 'groups', groups: 3, each: 2 });
});

test('the guide covers every grade, and code can check every example in it', () => {
  assert.deepEqual(Object.keys(GUIDE).map(Number), [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]);
  for (const grade of Object.keys(GUIDE).map(Number)) {
    for (const [topic, levels] of Object.entries(GUIDE[grade])) {
      assert.equal(levels.length, 3, `Grade ${grade} ${topic} needs 3 levels`);
      for (const level of [1, 2, 3]) {
        const examples = examplesOf(grade, topic, level);
        assert.equal(examples.length, 2, `Grade ${grade} ${topic} level ${level} needs 2 examples`);
        examples.forEach((display) => assert.ok(onTopic(topic, display, grade), `Grade ${grade} ${topic}: "${display}" is off topic`));
      }
    }
  }
  assert.equal(gradeFor('senior', 10), 10);
  assert.equal(gradeFor('senior', 3), 9); // a grade from another version: use the middle one
  assert.equal(solveQuestion({ display: '8^(2/3) = ?' }).value.toFixed(6), '4.000000');
});

test('makeQuestions asks for the grade, groups by topic and level, and counts the rejects', async () => {
  let asked;
  const ask = async (prompt) => {
    asked = prompt;
    return {
      questions: [
        good,
        { ...good, level: 1, display: '3x + 2 = 11', answer: 'x=3' },
        { ...good, answer: 'x=9' }, // wrong
        good, // repeat
        { ...good, level: 3, display: '4(x − 1) = 20', answer: '6', story: 'Four dragons each guard the same pile of gold.' },
      ],
    };
  };
  const { grade, questions, rejected } = await makeQuestions({ version: 'senior', grade: 8, topics: ['algebra', 'geometry', 'nonsense'] }, ask);
  assert.equal(grade, 8);
  assert.deepEqual(Object.keys(questions), ['algebra']); // geometry is made by the app
  assert.equal(questions.algebra[1].length, 1);
  assert.equal(questions.algebra[2].length, 1);
  assert.equal(questions.algebra[3][0].answer, 'x=6');
  assert.ok(questions.algebra[3][0].story);
  assert.equal(rejected, 2);
  assert.match(asked.system, /GRADE 8/);
  assert.match(asked.user, /Level 3 \(4 questions\): Equations with one bracket/);
  assert.match(asked.user, /word problem/);

  // Sums already used in this run are not sent again
  const again = await makeQuestions({ version: 'senior', grade: 8, topics: ['algebra'], avoid: ['3x + 2 = 11'] }, ask);
  assert.equal(again.questions.algebra[1].length, 0);
  assert.match(asked.user, /already had these/);

  // Nothing for the AI to do: no call is made
  let called = false;
  const none = await makeQuestions({ version: 'senior', grade: 8, topics: ['geometry'] }, async () => ((called = true), {}));
  assert.deepEqual(none.questions, {});
  assert.equal(called, false);
  await assert.rejects(makeQuestions({ version: 'wizard' }, ask), /Unknown version/);
});

test('hints never give the answer away', async () => {
  assert.ok(givesAway('So x = 7, well done', 'x=7'));
  assert.ok(!givesAway('Try adding 4 to both sides first. What is 10 + 4?', 'x=7'));
  assert.ok(!givesAway('There are 17 orbs', '7'));
  const q = { display: '2x − 4 = 10', answer: 'x=7' };
  assert.equal(await makeHint({ version: 'senior', question: q, givenAnswer: 'x=3' }, async () => ({ hint: 'x is 7!' })), null);
  let system;
  assert.equal(
    await makeHint({ version: 'senior', grade: 10, question: q, givenAnswer: 'x=3' }, async (p) => ((system = p.system), { hint: 'Did you add 4 to both sides?' })),
    'Did you add 4 to both sides?',
  );
  assert.match(system, /Grade 10/);
});

const run = {
  version: 'senior',
  grade: 8,
  won: false,
  floorsCleared: 4,
  floors: 10,
  topics: [
    { topic: 'algebra', attempts: 6, correct: 2, timeMs: 60000, hints: 3 },
    { topic: 'fractions', attempts: 5, correct: 5, timeMs: 40000, hints: 0 },
    { topic: 'x', attempts: 0 },
  ],
  mistakes: [{ topic: 'algebra', level: 1, display: '5x + 3 = −22', answer: 'x=-5', given: 'x = 5' }],
};

test('the run summary is built from the real results', async () => {
  const facts = runFacts(cleanStats(run.topics));
  assert.equal(facts.weakest.topic, 'algebra');
  assert.equal(facts.strongest.topic, 'fractions');
  assert.equal(facts.accuracy, 64);

  let sent;
  const result = await makeSummary(run, async (p) => {
    sent = p.user;
    return { summary: 'Your fractions were perfect: 5 out of 5. In algebra you answered x = 5 where it was −5, so watch the sign when a negative number is divided. Say the sign out loud before you write each step.', focusTopic: 'fractions' };
  });
  // The topic to practise comes from the numbers, not from the AI
  assert.equal(result.focusTopic, 'algebra');
  assert.match(sent, /algebra: 2 right out of 6 \(33%\), 4 wrong, 3 hints/);
  assert.match(sent, /Topic to practise \(most trouble\): algebra/);
  assert.match(sent, /5x \+ 3 = −22 → x=-5; answered x = 5/);
  assert.doesNotMatch(sent, /- x:/);
});

test('a summary with made-up numbers is thrown away', async () => {
  assert.equal(await makeSummary(run, async () => ({ summary: 'You got 92% in algebra, amazing!' })), null);
  assert.equal(await makeSummary({ ...run, topics: [] }, async () => ({ summary: 'Hello' })), null);
  const perfect = await makeSummary({ ...run, topics: [run.topics[1]], mistakes: [] }, async (p) => {
    assert.match(p.user, /NO wrong answers/);
    return { summary: 'Every fractions answer was right. Try harder spell cards next time.' };
  });
  assert.equal(perfect.focusTopic, null);
});

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { answerValue, checks, evaluate } from '../src/maths/evaluate.js';

test('works out the sums the game uses', () => {
  assert.equal(evaluate('6 × 24'), 144);
  assert.equal(evaluate('84 ÷ 4'), 21);
  assert.equal(evaluate('−3 × (4 − 9)'), 15);
  assert.equal(evaluate('3(10) + 2'), 32);
  assert.equal(evaluate('½ of 36'), 18);
  assert.equal(evaluate('2^3 + 1'), 9);
  assert.equal(evaluate('2x', 7), 14);
});

test('reads answers', () => {
  assert.equal(answerValue('x = 7'), 7);
  assert.equal(answerValue('7/8'), 0.875);
  assert.equal(answerValue('55°'), 55);
  assert.equal(answerValue('−4'), -4);
});

test('checks equations with the answer put in', () => {
  assert.ok(checks('2x − 4 = 10', 'x=7'));
  assert.ok(checks('35° + 90° + x = 180°', 'x=55'));
  assert.ok(checks('3/4 + 1/8 = ?', '7/8'));
  assert.ok(checks('7 + 5 = ?', '12'));
  assert.ok(checks('2(8) + 2(5) = ?', '26'));
  assert.ok(!checks('2x − 4 = 10', 'x=8'));
  assert.ok(!checks('7 + 5 = ?', '13'));
  assert.ok(!checks('Median of 4, 9, 2', '5'));
  assert.ok(!checks('process.exit()', '1'));
});

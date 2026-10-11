import { test } from 'node:test';
import assert from 'node:assert/strict';
import { solveQuestion } from '../src/maths/solve.js';

const value = (display, instruction = '', topic = '') => {
  const solved = solveQuestion({ display, instruction, topic });
  return solved ? Math.round(solved.value * 1e6) / 1e6 : null;
};

test('works out sums and equations', () => {
  assert.equal(value('6 × 24 = ?'), 144);
  assert.equal(value('6 + ? = 13'), 7);
  assert.equal(value('? × 3 + 3 = 24'), 7);
  assert.equal(value('2x − 4 = 10'), 7);
  assert.equal(value('5x + 1 = x + 25'), 6);
  assert.equal(value('3(x − 4) = −21'), -3);
  assert.equal(value('x/2 + x/3 = 10'), 12);
  assert.equal(value('(x + 1)/2 = (x + 5)/3'), 7);
  assert.equal(value('54/x = 9'), 6);
  assert.equal(value('1/x + 1/12 = 1/4'), 6);
  assert.equal(value('2^(x + 2) = 32'), 3);
  assert.equal(value('3 x 4 = ?'), 12); // x used as a times sign
  assert.equal(value('3x + 5 = ?', 'If x = 4, find the value'), 17);
});

test('quadratics need the question to say which answer', () => {
  assert.equal(value('x² + x − 12 = 0'), null);
  assert.equal(value('x² + x − 12 = 0', 'Solve for x, where x > 0'), 3);
  assert.equal(value('3x² − 8x − 3 = 0', 'Solve for x, where x > 0'), 3);
  assert.equal(value('x² = 4x + 5', 'Solve for x, where x > 0'), 5);
});

test('works out number patterns', () => {
  assert.equal(value('3, 7, 11, 15, ?'), 19);
  assert.equal(value('90, 85, 80, 75, ?'), 70);
  assert.equal(value('3, 6, 12, 24, ?'), 48);
  assert.equal(value('2, 4, 8, 14, ?'), 22); // quadratic
  assert.equal(value('13, 15, 17, 19, … T₁₀ = ?'), 31);
  assert.equal(value('8, 20, 38, 62, … T₆ = ?'), 128);
  assert.equal(value('6, 11, 16, 21, … n = ?', 'Which term of the pattern is 66?'), 13);
  assert.equal(value('6, 11, 16, 21, … n = ?', 'Which term of the pattern is 67?'), null); // not in the pattern
  assert.equal(value('T₁₀ = ?', 'Tₙ = 3n + 2 · find T₁₀'), 32);
  assert.equal(value('T₇ = ?', 'Tₙ = 2n² + 3n + 3 · find T₇'), 122);
  assert.equal(value('8n + 1 = 73'), 9);
  assert.equal(value('1, 2, 4, 7, 12, ?'), null); // no rule code can be sure of
});

test('works out data questions', () => {
  assert.equal(value('Median of 4, 9, 2, 7, 5'), 5);
  assert.equal(value('Median of 20, 12, 22, 10, 24, 7'), 16);
  assert.equal(value('Mean of 15, 17, 14, 19, 10'), 15);
  assert.equal(value('Mode of 8, 6, 6, 11, 7, 5, 6'), 6);
  assert.equal(value('Mode of 1, 2, 3, 4, 5'), null); // no mode
  assert.equal(value('Range of 21, 13, 15, 12, 30'), 18);
  assert.equal(value('Mean of 21, 30, x, 21 is 23'), 20);
  assert.equal(value('Q1 of 21, 28, 7, 36, 33, 14, 49'), 14);
  assert.equal(value('IQR of 20, 12, 31, 46, 40, 32, 30'), 20);
  assert.equal(value('Variance of 24, 14, 18, 20'), 13);
  assert.equal(value('Standard deviation of 14, 12, 14, 12'), 1);
  assert.equal(value('σ² of 24, 14, 18, 20'), 13);
  assert.equal(value('4, 9, 2, 7, 5', 'Find the median', 'data'), 5);
});

test('gives up on anything that is not maths', () => {
  assert.equal(value('Solve the riddle'), null);
  assert.equal(value('process.exit()'), null);
  assert.equal(value('5 m = ? cm'), null);
});

// ---------------------------------------------------------------------------
// What the AI is told about each grade's maths.
//
// South African CAPS mathematics, Grade 1 to Grade 11 (Grades 10 and 11 are
// "pure" Mathematics, not Mathematical Literacy). For every grade and every
// maths area in the game there are three difficulty levels:
//   level 1  the basic skill of that grade
//   level 2  the normal classwork of that grade
//   level 3  the hardest work of that grade
// Each level says what kind of sum to make, how big the numbers are, and
// gives two examples written exactly the way the game shows a sum.
//
// The game's own sum maker (Tower-of-Arithmetic/src/game/generators) follows
// the same plan, so AI sums and built-in sums feel the same. Geometry is not
// here: it is made by an algorithm in the app, which also draws the shape.
// ---------------------------------------------------------------------------

export const GUIDE = {
  1: {
    adding: [
      'Add two numbers with a total of 10 or less. Examples: 3 + 4 = ? | 6 + 2 = ?',
      'Add two numbers with a total from 11 to 20. Examples: 8 + 7 = ? | 9 + 6 = ?',
      'Find the missing number in an addition with a total up to 20. Examples: 6 + ? = 13 | 9 + ? = 17',
    ],
    takingAway: [
      'Subtract within 10. Examples: 9 − 3 = ? | 7 − 5 = ?',
      'Subtract a one-digit number from a number between 11 and 20. Examples: 15 − 6 = ? | 18 − 9 = ?',
      'Find the missing number in a subtraction within 20. Examples: 14 − ? = 8 | 12 − ? = 5',
    ],
    times: [
      '2 to 5 equal groups of 2 (repeated addition). Examples: 3 × 2 = ? | 5 × 2 = ?',
      'Equal groups of 5 or 10 with an answer of 20 or less. Examples: 3 × 5 = ? | 2 × 10 = ?',
      '3 to 5 equal groups of 5 or 10. Examples: 4 × 5 = ? | 5 × 10 = ?',
    ],
    patterns: [
      'Counting on in 1s from a number below 15. Examples: 5, 6, 7, 8, ? | 11, 12, 13, 14, ?',
      'Counting on in 2s or in 10s. Examples: 2, 4, 6, 8, ? | 10, 20, 30, 40, ?',
      'Counting on in 5s, or counting back in 1s from 20 or less. Examples: 5, 10, 15, 20, ? | 12, 11, 10, 9, ?',
    ],
  },
  2: {
    adding: [
      'Add two one-digit numbers that bridge ten (total 11 to 18). Examples: 7 + 6 = ? | 8 + 9 = ?',
      'Add a one-digit number to a two-digit number, or add two multiples of 10 (total below 100). Examples: 34 + 7 = ? | 40 + 30 = ?',
      'Add two two-digit numbers with a total below 100. Examples: 36 + 27 = ? | 45 + 38 = ?',
    ],
    takingAway: [
      'Subtract a one-digit number from 11 to 18, bridging ten. Examples: 15 − 9 = ? | 13 − 6 = ?',
      'Subtract a one-digit number from a two-digit number, or subtract multiples of 10. Examples: 62 − 5 = ? | 70 − 30 = ?',
      'Subtract a two-digit number from a two-digit number. Examples: 74 − 26 = ? | 91 − 47 = ?',
    ],
    times: [
      'The 2 and 10 times tables, up to 10 groups. Examples: 7 × 2 = ? | 6 × 10 = ?',
      'The 5 and 3 times tables, up to 10 groups. Examples: 8 × 5 = ? | 6 × 3 = ?',
      'The 4 times table, and the harder half of the 3 times table. Examples: 7 × 4 = ? | 9 × 3 = ?',
    ],
    patterns: [
      'Counting on in 2s, 5s or 10s from a multiple (numbers up to 200). Examples: 20, 25, 30, 35, ? | 60, 70, 80, 90, ?',
      'Counting on in 3s or 4s from a multiple. Examples: 12, 15, 18, 21, ? | 8, 12, 16, 20, ?',
      'Counting back in 2s, 5s or 10s. Examples: 90, 85, 80, 75, ? | 46, 44, 42, 40, ?',
    ],
  },
  3: {
    adding: [
      'Add two two-digit numbers with a total below 100. Examples: 47 + 36 = ? | 28 + 55 = ?',
      'Add a two-digit number to a three-digit number (total below 1000). Examples: 245 + 32 = ? | 618 + 57 = ?',
      'Add two three-digit numbers with carrying (total below 1000). Examples: 368 + 257 = ? | 449 + 386 = ?',
    ],
    takingAway: [
      'Subtract two-digit numbers. Examples: 83 − 47 = ? | 62 − 28 = ?',
      'Subtract a two-digit number from a three-digit number. Examples: 352 − 48 = ? | 715 − 63 = ?',
      'Subtract a three-digit number from a three-digit number, with borrowing. Examples: 734 − 258 = ? | 902 − 467 = ?',
    ],
    times: [
      'The 2, 5 and 10 times tables, 3 to 10 groups. Examples: 9 × 5 = ? | 7 × 10 = ?',
      'The 3 and 4 times tables, 3 to 10 groups. Examples: 8 × 3 = ? | 9 × 4 = ?',
      'Multiply 2, 3, 4 or 5 by a number from 11 to 20 (answers up to 100). Examples: 4 × 13 = ? | 5 × 18 = ?',
    ],
    patterns: [
      'Counting on in 20s, 25s, 50s or 100s. Examples: 25, 50, 75, 100, ? | 150, 200, 250, 300, ?',
      'Counting on in 3s, 4s or 10s from any number (up to 200). Examples: 37, 47, 57, 67, ? | 22, 26, 30, 34, ?',
      'Counting back in 3s, 4s, 20s or 50s. Examples: 400, 350, 300, 250, ? | 41, 38, 35, 32, ?',
    ],
  },
  4: {
    multiplication: [
      'Times-table facts from 3 × 3 to 10 × 10. Examples: 7 × 8 = ? | 6 × 9 = ?',
      'A two-digit number times a one-digit number. Examples: 24 × 6 = ? | 37 × 4 = ?',
      'A two-digit number times a two-digit number (both below 40). Examples: 23 × 14 = ? | 31 × 26 = ?',
    ],
    division: [
      'Division facts from the times tables (no remainder). Examples: 56 ÷ 7 = ? | 81 ÷ 9 = ?',
      'A two-digit number divided by a one-digit number, no remainder. Examples: 84 ÷ 4 = ? | 96 ÷ 6 = ?',
      'A three-digit number divided by a one-digit number, no remainder. Examples: 252 ÷ 9 = ? | 384 ÷ 6 = ?',
    ],
    fractions: [
      'A unit fraction of a whole number (halves, thirds, quarters, fifths, tenths). Examples: 1/4 of 20 = ? | 1/5 of 35 = ?',
      'A non-unit fraction of a whole number, whole-number answer. Examples: 3/4 of 24 = ? | 2/5 of 40 = ?',
      'Add or subtract two fractions with the SAME denominator; the answer is a fraction smaller than 1 already in simplest form. Examples: 3/8 + 2/8 = ? | 6/7 − 2/7 = ?',
    ],
    patterns: [
      'A pattern that goes up by the same amount (2 to 10). Examples: 12, 18, 24, 30, ? | 7, 11, 15, 19, ?',
      'A pattern that goes down by the same amount (2 to 10). Examples: 52, 45, 38, 31, ? | 60, 54, 48, 42, ?',
      'A pattern where each number is double the one before. Examples: 3, 6, 12, 24, ? | 5, 10, 20, 40, ?',
    ],
    data: [
      'The mode of 6 small whole numbers (one clear mode). Examples: Mode of 6, 4, 2, 8, 4, 5 | Mode of 3, 7, 7, 2, 9, 5',
      'The range of 5 whole numbers below 30. Examples: Range of 21, 13, 15, 12, 30 | Range of 8, 25, 17, 4, 19',
      'The total of 4 whole numbers below 25. Examples: Total of 6, 11, 17, 23 | Total of 14, 9, 21, 8',
    ],
  },
  5: {
    multiplication: [
      'A two-digit number times a one-digit number. Examples: 72 × 7 = ? | 48 × 6 = ?',
      'A three-digit number times a one-digit number. Examples: 582 × 6 = ? | 247 × 8 = ?',
      'A three-digit number times a two-digit number (the second below 50). Examples: 314 × 13 = ? | 226 × 34 = ?',
    ],
    division: [
      'A two-digit number divided by a one-digit number, no remainder. Examples: 90 ÷ 6 = ? | 84 ÷ 7 = ?',
      'A three-digit number divided by a one-digit number, no remainder. Examples: 590 ÷ 5 = ? | 696 ÷ 8 = ?',
      'A three-digit number divided by a two-digit number (11 to 25), no remainder. Examples: 368 ÷ 16 = ? | 504 ÷ 21 = ?',
    ],
    fractions: [
      'A non-unit fraction of a whole number, whole-number answer. Examples: 2/3 of 18 = ? | 5/6 of 42 = ?',
      'Add or subtract two fractions with the SAME denominator; the answer is a fraction smaller than 1 already in simplest form. Examples: 2/9 + 5/9 = ? | 7/10 − 4/10 = ?',
      'Add or subtract two fractions where one denominator is a multiple of the other; simplest form. Examples: 1/2 + 1/4 = ? | 2/3 − 1/6 = ?',
    ],
    patterns: [
      'A pattern that goes up or down by the same amount (6 to 25), numbers up to 300. Examples: 192, 171, 150, 129, ? | 45, 62, 79, 96, ?',
      'A pattern where each number is 2, 3 or 4 times the one before. Examples: 4, 12, 36, 108, ? | 2, 8, 32, 128, ?',
      'A flow-diagram rule with two steps, written as one sum. Examples: 7 × 4 + 5 = ? | 9 × 3 − 6 = ?',
    ],
    data: [
      'The mode of 7 whole numbers (one clear mode). Examples: Mode of 5, 17, 9, 16, 20, 17, 13 | Mode of 8, 12, 8, 15, 6, 19, 11',
      'The median of 5 whole numbers that are NOT in order. Examples: Median of 12, 3, 13, 19, 7 | Median of 20, 5, 14, 9, 16',
      'The median of 7 whole numbers that are NOT in order. Examples: Median of 29, 16, 22, 6, 27, 31, 34 | Median of 18, 40, 7, 25, 33, 12, 21',
    ],
  },
  6: {
    multiplication: [
      'A three-digit number times a one-digit number. Examples: 964 × 6 = ? | 537 × 8 = ?',
      'A three-digit number times a two-digit number. Examples: 325 × 39 = ? | 418 × 56 = ?',
      'A four-digit number times a two-digit number. Examples: 1655 × 53 = ? | 2408 × 27 = ?',
    ],
    division: [
      'A three-digit number divided by a one-digit number, no remainder. Examples: 873 ÷ 9 = ? | 536 ÷ 4 = ?',
      'A three-digit number divided by a two-digit number, no remainder. Examples: 756 ÷ 18 = ? | 896 ÷ 32 = ?',
      'A four-digit number divided by a two-digit number, no remainder. Examples: 7364 ÷ 28 = ? | 3105 ÷ 15 = ?',
    ],
    fractions: [
      'Add or subtract two fractions where one denominator is a multiple of the other; simplest form. Examples: 1/3 + 2/9 = ? | 3/4 − 3/8 = ?',
      'A percentage (10%, 20%, 25%, 50% or 75%) of a whole number, whole-number answer. Examples: 25% of 80 = ? | 20% of 45 = ?',
      'Add or subtract decimals with one and two decimal places. Examples: 2.5 + 1.75 = ? | 8.4 − 3.25 = ?',
    ],
    patterns: [
      'A pattern that goes up or down by the same amount (15 to 125), numbers up to 1000. Examples: 296, 261, 226, 191, ? | 340, 415, 490, 565, ?',
      'A pattern where each number is 3, 4 or 5 times the one before. Examples: 2, 10, 50, 250, ? | 3, 12, 48, 192, ?',
      'Find the input of a two-step flow diagram, written as a sum with one missing number. Examples: ? × 3 + 3 = 24 | ? × 5 − 4 = 31',
    ],
    data: [
      'The median of 5 whole numbers below 60 that are NOT in order. Examples: Median of 12, 46, 40, 24, 49 | Median of 35, 18, 52, 27, 44',
      'The median of 6 whole numbers NOT in order, where the two middle numbers give a whole-number answer. Examples: Median of 4, 18, 6, 30, 14, 16 | Median of 22, 9, 15, 28, 11, 19',
      'The median of 8 whole numbers NOT in order, whole-number answer. Examples: Median of 12, 59, 41, 33, 31, 50, 21, 43 | Median of 17, 45, 28, 36, 52, 24, 39, 30',
    ],
  },
  7: {
    algebra: [
      'One-step equations with whole numbers. Examples: x + 7 = 15 | 4x = 28',
      'Two-step equations with a positive whole-number answer. Examples: 3x + 2 = 14 | 5x − 7 = 33',
      'Substitution: the instruction gives the value ("If x = 4, find the value") and the display is the expression. Examples: 3x + 5 = ? | 6x − 4 = ?',
    ],
    fractions: [
      'Add or subtract fractions with the same denominator, then simplify. Examples: 5/12 + 1/12 = ? | 10/12 − 7/12 = ?',
      'Add or subtract fractions with different denominators (LCM 40 or less), positive answer in simplest form. Examples: 1/2 + 1/3 = ? | 5/6 − 3/4 = ?',
      'Multiply two fractions and simplify. Examples: 2/3 × 3/5 = ? | 4/7 × 1/2 = ?',
    ],
    arithmetic: [
      'Order of operations with whole numbers (brackets, × ÷ before + −). Examples: 4 + 3 × 6 = ? | (2 + 5) × 3 − 4 = ?',
      'Adding and subtracting integers (negative numbers). Examples: −7 + 12 = ? | 6 − (−9) = ?',
      'Squares, cubes and square roots of whole numbers in a short sum. Examples: 5² + √36 = ? | 3³ − 8 = ?',
    ],
    patterns: [
      'The next term of a pattern with a constant difference. Examples: 15, 23, 31, 39, ? | 4, 11, 18, 25, ?',
      'Use a given rule to find a term. The instruction holds the rule ("Tₙ = 3n + 2 · find T₁₀") and the display asks for the term. Examples: T₁₀ = ? | T₈ = ?',
      'Find the 10th term of a pattern with a constant difference. Examples: 13, 15, 17, 19, … T₁₀ = ? | 5, 9, 13, 17, … T₁₀ = ?',
    ],
    data: [
      'The range or the mode of 6 or 7 whole numbers. Examples: Range of 14, 31, 8, 22, 40, 17 | Mode of 8, 6, 6, 11, 7, 5, 6',
      'The median of 5 whole numbers NOT in order. Examples: Median of 11, 3, 40, 39, 6 | Median of 24, 9, 31, 15, 20',
      'The mean of 5 whole numbers, with a whole-number answer. Examples: Mean of 15, 17, 14, 19, 10 | Mean of 8, 12, 20, 6, 14',
    ],
  },
  8: {
    algebra: [
      'Two-step equations where the answer or the numbers may be negative. Examples: 5x + 3 = −22 | 4x − 9 = 15',
      'Equations with x on both sides. Examples: 5x + 1 = x + 25 | 7x − 4 = 3x + 12',
      'Equations with one bracket to multiply out. Examples: 6(x + 1) = 24 | 3(x − 4) = −21',
    ],
    fractions: [
      'Add or subtract fractions with different denominators, simplest form. Examples: 5/8 + 1/4 = ? | 2/3 − 1/5 = ?',
      'Multiply or divide two fractions, simplest form. Examples: 3/4 × 4/7 = ? | 2/5 ÷ 3/10 = ?',
      'Add or subtract fractions where the first is negative; the answer may be negative. Examples: −3/4 + 1/6 = ? | −1/2 − 2/3 = ?',
    ],
    arithmetic: [
      'Multiplying and dividing integers. Examples: −6 × 7 = ? | −48 ÷ (−8) = ?',
      'Order of operations with a negative number and one bracket. Examples: −3 × (4 − 9) = ? | 4 − 6 × (−2) = ?',
      'Powers of negative numbers, or the law for multiplying powers of the same base (answer as a number). Examples: (−2)³ + 5 = ? | 2³ × 2² = ?',
    ],
    patterns: [
      'Use a given rule to find a term up to T₂₀. The instruction holds the rule ("Tₙ = 4n + 3 · find T₁₆"). Examples: T₁₆ = ? | T₂₀ = ?',
      'Find the 20th term of a pattern with a constant difference. Examples: 14, 21, 28, 35, … T₂₀ = ? | 3, 8, 13, 18, … T₂₀ = ?',
      'Find which term has a given value: an equation in n. Examples: 8n + 1 = 73 | 5n − 2 = 98',
    ],
    data: [
      'The median of 6 whole numbers NOT in order (whole-number answer). Examples: Median of 20, 12, 22, 10, 24, 7 | Median of 5, 31, 14, 18, 9, 26',
      'The mean of 6 whole numbers, with a whole-number answer. Examples: Mean of 20, 2, 26, 28, 8, 6 | Mean of 11, 17, 9, 23, 14, 16',
      'A missing value when the mean is given. Examples: Mean of 21, 30, x, 21 is 23 | Mean of 8, x, 15, 12 is 11',
    ],
  },
  9: {
    algebra: [
      'Equations with a bracket and x on both sides. Examples: 3(x + 5) = x + 29 | 4(x − 2) = 2x + 6',
      'Equations with x divided by a number. Examples: x/3 − 3 = −1 | x/4 + 7 = 12',
      'Simple quadratic equations solved by factorising or square roots; the instruction must say "where x > 0" and exactly one answer may be positive. Examples: x² + x − 12 = 0 | x² = 81',
    ],
    fractions: [
      'Divide a fraction by a fraction, simplest form. Examples: 3/4 ÷ 1/8 = ? | 2/5 ÷ 7/10 = ?',
      'Order of operations with three fractions (multiply before adding). Examples: 1/6 + 2/3 × 3/4 = ? | 1/2 + 3/4 × 2/3 = ?',
      'Equations with fractions of x; whole-number answer. Examples: x/2 + x/3 = 10 | x/4 + x/2 = 9',
    ],
    arithmetic: [
      'Order of operations with integers, two steps, including a negative result. Examples: (3 − 8) × 4 − 6 = ? | 24 ÷ (−4) − (−9) = ?',
      'Laws of exponents with numbers (dividing powers, power of a power), answer as a number. Examples: 2⁷ ÷ 2⁴ = ? | (3²)² = ?',
      'Negative and zero exponents; the answer may be a fraction. Examples: 2^(−3) = ? | 5⁰ + 2^(−1) = ?',
    ],
    patterns: [
      'Find a term between T₁₅ and T₃₀ of a pattern with a constant difference (which may be negative). Examples: 15, 25, 35, 45, … T₂₈ = ? | 80, 74, 68, 62, … T₂₀ = ?',
      'Find which term has a given value. The instruction says "Which term of the pattern is 66?". Examples: 6, 11, 16, 21, … n = ? | 9, 13, 17, 21, … n = ?',
      'The next term of a geometric pattern (constant ratio 2 to 5). Examples: 3, 6, 12, 24, ? | 2, 10, 50, 250, ?',
    ],
    data: [
      'The mean of 6 whole numbers up to 60, whole-number answer. Examples: Mean of 5, 18, 49, 11, 23, 50 | Mean of 32, 14, 27, 41, 19, 35',
      'A missing value when the mean of 5 numbers is given. Examples: Mean of 18, 10, 24, x, 20 is 20 | Mean of 7, 15, x, 12, 9 is 11',
      'The mean of 8 whole numbers, whole-number answer. Examples: Mean of 12, 30, 18, 24, 9, 21, 15, 39 | Mean of 44, 26, 35, 17, 50, 38, 29, 41',
    ],
  },
  10: {
    algebra: [
      'Linear equations with x on both sides and bigger or negative numbers. Examples: 7x + 4 = 4x − 5 | 11x − 9 = 6x + 21',
      'Quadratic equations x² + bx + c = 0 that factorise with one positive and one negative answer; the instruction must say "where x > 0". Examples: x² + 2x − 8 = 0 | x² − 3x − 28 = 0',
      'Exponential equations with a whole-number answer. Examples: 2^x = 32 | 3^x = 81',
    ],
    fractions: [
      'Equations with a bracket over a number. Examples: (x + 1)/5 = 3 | (x − 4)/3 = −2',
      'Equations with two fractions of x subtracted. Examples: x/2 − x/4 = 4 | x/3 − x/6 = 5',
      'Equations with a fraction on each side (cross-multiply). Examples: (x + 1)/2 = (x + 5)/3 | (2x − 1)/3 = (x + 2)/2',
    ],
    arithmetic: [
      'Laws of exponents with three powers of the same base, answer as a number. Examples: 2⁵ ÷ 2² × 2 = ? | 3⁶ ÷ 3⁴ × 3 = ?',
      'Rational exponents with 1 as the numerator. Examples: 8^(1/3) = ? | 81^(1/4) = ?',
      'Multiplying or dividing surds, whole-number answer. Examples: √12 × √3 = ? | √98 ÷ √2 = ?',
    ],
    patterns: [
      'Find the 50th term of a linear pattern. Examples: 13, 23, 33, 43, … T₅₀ = ? | 7, 11, 15, 19, … T₅₀ = ?',
      'Find which term of a linear pattern has a given value (n up to 60). The instruction says "Which term of the pattern is 125?". Examples: 7, 9, 11, 13, … n = ? | 5, 8, 11, 14, … n = ?',
      'The next term of a quadratic pattern (constant second difference). Examples: 2, 4, 8, 14, ? | 3, 8, 15, 24, ?',
    ],
    data: [
      'The mean of 8 whole numbers, whole-number answer. Examples: Mean of 28, 45, 60, 23, 10, 26, 33, 23 | Mean of 16, 52, 37, 44, 21, 30, 48, 8',
      'The lower quartile (Q1) or upper quartile (Q3) of 7 different whole numbers NOT in order. Examples: Q1 of 21, 28, 7, 36, 33, 14, 49 | Q3 of 12, 40, 25, 8, 31, 19, 46',
      'The interquartile range of 7 different whole numbers NOT in order. Examples: IQR of 20, 12, 31, 46, 40, 32, 30 | IQR of 9, 27, 15, 38, 22, 44, 33',
    ],
  },
  11: {
    algebra: [
      'Quadratic equations that must first be rearranged to equal 0; the instruction must say "where x > 0" and exactly one answer may be positive. Examples: x² = 4x + 5 | x² = 2x + 15',
      'Quadratic equations ax² + bx + c = 0 with a = 2 or 3 and exactly one positive whole-number answer; the instruction must say "where x > 0". Examples: 3x² − 8x − 3 = 0 | 2x² − 5x − 12 = 0',
      'Exponential equations with a shifted exponent. Examples: 2^(x + 2) = 32 | 3^(x − 1) = 27',
    ],
    fractions: [
      'Equations with two fractions of x; whole-number answer. Examples: x/2 + x/3 = 20 | x/3 − x/4 = 2',
      'Equations with x in the denominator. Examples: 54/x = 9 | 36/x = 4',
      'Equations with unit fractions and x in the denominator; whole-number answer. Examples: 1/x + 1/12 = 1/4 | 1/x + 1/6 = 1/2',
    ],
    arithmetic: [
      'Rational exponents with a numerator bigger than 1. Examples: 8^(2/3) = ? | 16^(3/4) = ?',
      'Multiplying or dividing surds, whole-number answer. Examples: √75 ÷ √3 = ? | √18 × √2 = ?',
      'Squaring a sum of two surds, whole-number answer. Examples: (√8 + √2)² = ? | (√12 + √3)² = ?',
    ],
    patterns: [
      'The next term of a quadratic pattern (constant second difference). Examples: −2, −2, 0, 4, ? | 4, 9, 18, 31, ?',
      'Use a quadratic rule to find a term. The instruction holds the rule ("Tₙ = 2n² + 3n + 3 · find T₇"). Examples: T₇ = ? | T₅ = ?',
      'Find the 6th term of a quadratic pattern from its first four terms. Examples: 8, 20, 38, 62, … T₆ = ? | 1, 6, 15, 28, … T₆ = ?',
    ],
    data: [
      'The interquartile range of 11 different whole numbers NOT in order. Examples: IQR of 15, 39, 41, 2, 32, 13, 19, 6, 18, 35, 16 | IQR of 8, 27, 44, 12, 36, 21, 5, 30, 48, 17, 25',
      'The variance of 4 or 5 whole numbers, chosen so the mean and the variance are whole numbers. Examples: Variance of 24, 14, 18, 20 | Variance of 4, 6, 8, 10, 12',
      'The standard deviation of 4 or 5 whole numbers, chosen so the answer is a whole number. Examples: Standard deviation of 14, 12, 14, 12 | Standard deviation of 5, 7, 8, 9, 11',
    ],
  },
};

// The grades in each version of the game, and the grade to use when the
// player hasn't chosen one that fits.
export const GRADES = {
  junior: { low: 1, high: 3, middle: 2 },
  intermediate: { low: 4, high: 6, middle: 5 },
  senior: { low: 7, high: 11, middle: 9 },
};

export function gradeFor(version, grade) {
  const { low, high, middle } = GRADES[version];
  const g = Math.round(Number(grade));
  return g >= low && g <= high ? g : middle;
}

// The two example sums written in a level's description.
export function examplesOf(grade, topic, level) {
  const text = GUIDE[grade]?.[topic]?.[level - 1] ?? '';
  return (text.split('Examples:')[1] ?? '').split('|').map((e) => e.trim()).filter(Boolean);
}

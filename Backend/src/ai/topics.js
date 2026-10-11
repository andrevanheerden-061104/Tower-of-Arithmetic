// The maths each version covers (South African CAPS), by the same topic ids
// the game uses (Tower-of-Arithmetic/src/game/versions.js).

export const VERSIONS = {
  junior: {
    grades: 'Grades 1 to 3 (ages 6 to 9)',
    answerMode: 'tap', // the player taps one of three answers
    topics: {
      adding: 'Adding two whole numbers (totals up to 20 on low floors, up to 100 on high floors).',
      takingAway: 'Subtracting whole numbers with answers of 0 or more (from up to 20, then up to 100).',
      times: 'Multiplying as equal groups: 2s, 5s and 10s, then 3s and 4s (answers up to 50).',
      patterns: 'Number patterns: counting on in 1s, 2s, 5s or 10s. Find the next number.',
    },
  },
  intermediate: {
    grades: 'Grades 4 to 6 (ages 9 to 12)',
    answerMode: 'type', // the player types the final answer
    topics: {
      multiplication: 'Multiplying a 2- or 3-digit number by a 1-digit number, then 2-digit by 2-digit.',
      division: 'Dividing by a 1-digit number with no remainder (e.g. 84 ÷ 4).',
      fractions: 'Fractions of whole numbers (½ of 36, ¾ of 24) and adding fractions with the same denominator.',
      measurement: 'Perimeter and area of rectangles and squares in cm or m.',
      patterns: 'Number patterns with a constant difference: find the next term.',
      data: 'Range, mode or mean of a short list of whole numbers.',
    },
  },
  senior: {
    grades: 'Grades 7 to 11 (ages 12 to 17)',
    answerMode: 'steps', // the player writes each step of working
    topics: {
      algebra: 'Solving linear equations for x: one step, two steps, then brackets and x on both sides. Whole-number answers.',
      geometry: 'Finding an unknown angle x: angles in a triangle, on a straight line, around a point, isosceles triangles.',
      fractions: 'Adding, subtracting and multiplying fractions; answers fully simplified (e.g. 7/8).',
      arithmetic: 'Integers and order of operations (brackets, then × ÷, then + −), including negatives and powers.',
      patterns: 'Linear number patterns Tn = an + b: find a term, or find n.',
      data: 'Mean, median, mode and range of a short data set.',
    },
  },
};

export function topicsFor(version) {
  return Object.keys(VERSIONS[version]?.topics ?? {});
}

import { INTERMEDIATE_LESSONS } from './intermediate';
import { JUNIOR_LESSONS } from './junior';
import { SENIOR_LESSONS } from './senior';

// ---------------------------------------------------------------------------
// Spell School: a short lesson for every maths topic in every version of the
// game (4 junior, 6 intermediate, 6 senior). Orrin explains the idea, shows
// worked examples, then the player tries one sum of their own.
//
// A lesson has:
//   title     e.g. "Solving for x"
//   tagline   one line under the big picture on the first page
//   hero      three symbols for the first page's picture (["x", "=", "?"])
//   badge     the badge earned at the end
//   learn     what the lesson covers (listed on the first page)
//   intro     what Orrin says on the first page
//   pages     the teaching pages: { title, blocks, orrin }
//             (blocks are made with the helpers in blocks.js)
//   practice  Orrin's tip on the practice page
//   done      what Orrin says on the last page
//
// The pages a player sees: the first page, the teaching pages, "Your turn"
// (one sum to try) and "Lesson complete".
// ---------------------------------------------------------------------------

const LESSONS = { junior: JUNIOR_LESSONS, intermediate: INTERMEDIATE_LESSONS, senior: SENIOR_LESSONS };

// The lowest grade of each version. The practice sum is a level 2 sum from
// this grade: the kind of sum the lesson has just shown.
const PRACTICE_GRADE = { junior: 1, intermediate: 4, senior: 7 };

export const lessonId = (versionId, topic) => `${versionId}:${topic}`;

export function getLesson(versionId, topic) {
  const lesson = LESSONS[versionId]?.[topic];
  return lesson ? { ...lesson, id: lessonId(versionId, topic), versionId, topic, practiceGrade: PRACTICE_GRADE[versionId] } : null;
}

export function hasLesson(versionId, topic) {
  return Boolean(LESSONS[versionId]?.[topic]);
}

// How many pages a lesson has, counting the first page, practice and the end.
export const pageCount = (lesson) => lesson.pages.length + 3;

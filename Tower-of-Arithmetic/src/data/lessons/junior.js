import { dots, numbers, steps, sum } from './blocks';

// Spell School lessons for Grades 1 to 3: one per maths topic.
// Short, simple sentences, big pictures.
export const JUNIOR_LESSONS = {
  adding: {
    title: 'Adding',
    tagline: 'Put them together',
    hero: ['3', '+', '2'],
    badge: 'Star Counter',
    learn: ['Adding means more', 'Count on', 'Make a ten'],
    intro: 'Adding puts things together. Let’s learn how!',
    pages: [
      {
        title: 'Put them together',
        blocks: [sum('3 + 2 = 5'), dots({ kind: 'dots', groups: [{ count: 3, color: 'gold' }, { count: 2, color: 'pink' }] }, '3 and 2 more make 5')],
        orrin: 'Here are 3 yellow dots. Here are 2 pink dots. Count them all. That makes 5!',
      },
      {
        title: 'Count on',
        blocks: [numbers([7, 8, 9, 10], ['+1', '+1', '+1'], 'Start at 7. Count on 3.')],
        orrin: 'Start with the big number. Then count on. 7… 8, 9, 10!',
      },
      {
        title: 'Make a ten',
        blocks: [steps(['Start', '8 + 5'], ['Step 1', '8 + 2 = 10', 'make 10'], ['Step 2', '10 + 3 = 13', '3 more'], ['Answer', '= 13'])],
        orrin: 'Ten is a magic number. Make 10 first. Then add the rest.',
      },
    ],
    practice: 'Start with the big number. Count on!',
    done: 'Yay! You can add! Now go and cast adding spells!',
  },

  takingAway: {
    title: 'Taking away',
    tagline: 'How many are left?',
    hero: ['5', '−', '2'],
    badge: 'Brave Subtractor',
    learn: ['Taking away means less', 'Count back', 'Find the missing number'],
    intro: 'Taking away makes a number smaller. Let’s see how!',
    pages: [
      {
        title: 'Take some away',
        blocks: [sum('7 − 3 = 4'), dots({ kind: 'takeAway', total: 7, gone: 3 }, '3 dots are gone. 4 are left.')],
        orrin: 'There are 7 dots. Cross out 3. How many are left? 4!',
      },
      {
        title: 'Count back',
        blocks: [numbers([9, 8, 7, 6], ['−1', '−1', '−1'], 'Start at 9. Count back 3.')],
        orrin: 'Start at the big number. Count back. 9… 8, 7, 6!',
      },
      {
        title: 'Find the missing number',
        blocks: [sum('9 − ? = 5'), steps(['Think', 'count up from 5 to 9'], ['Answer', '4'])],
        orrin: 'Count up from the small number to the big one. You count 4 steps. So 4 is missing!',
      },
    ],
    practice: 'Start at the big number. Count back!',
    done: 'Great job! You can take away! Go and try it in the tower!',
  },

  times: {
    title: 'Times',
    tagline: 'Groups of the same',
    hero: ['3', '×', '2'],
    badge: 'Group Builder',
    learn: ['Times means groups', 'Count in jumps', 'Your 2s, 5s and 10s'],
    intro: 'Times is a quick way to count groups. Let’s count!',
    pages: [
      {
        title: 'Groups',
        blocks: [sum('3 × 2 = 6'), dots({ kind: 'groups', groups: 3, each: 2 }, '3 groups of 2 make 6')],
        orrin: 'Here are 3 groups. Each group has 2. Count them all. That makes 6!',
      },
      {
        title: 'Count in jumps',
        blocks: [numbers([2, 4, 6, 8, 10], ['+2', '+2', '+2', '+2'], 'Count in 2s')],
        orrin: 'Count in jumps! Jump 2 each time. 2, 4, 6, 8, 10.',
      },
      {
        title: '5s and 10s',
        blocks: [numbers([5, 10, 15, 20], ['+5', '+5', '+5'], 'Count in 5s'), numbers([10, 20, 30, 40], ['+10', '+10', '+10'], 'Count in 10s')],
        orrin: 'Jump in 5s. Jump in 10s. You can do it with your fingers too!',
      },
    ],
    practice: 'Count the groups. Count in jumps!',
    done: 'Wow! You can do times! Go and cast your times spells!',
  },

  patterns: {
    title: 'Patterns',
    tagline: 'What comes next?',
    hero: ['2', '4', '?'],
    badge: 'Pattern Pal',
    learn: ['Patterns go up', 'Patterns go down', 'Find the jump'],
    intro: 'A pattern follows a rule. Find the rule. Then find the next number!',
    pages: [
      {
        title: 'Going up',
        blocks: [numbers([2, 4, 6, 8, '?'], ['+2', '+2', '+2', '+2'], 'Each one is 2 more. Next is 10!')],
        orrin: 'Look at the jumps. Each number is 2 more. So the next one is 10!',
      },
      {
        title: 'Going down',
        blocks: [numbers([20, 15, 10, 5, '?'], ['−5', '−5', '−5', '−5'], 'Each one is 5 less. Next is 0!')],
        orrin: 'Some patterns go down. Each number here is 5 less.',
      },
      {
        title: 'Find the jump',
        blocks: [numbers([10, 20, 30, 40, '?'], ['+10', '+10', '+10', '+10'], 'The jump is 10. Next is 50!')],
        orrin: 'Find the jump. Then do one more jump!',
      },
    ],
    practice: 'Find the jump. Do one more!',
    done: 'Super! You found the rules! Go and find more patterns!',
  },
};

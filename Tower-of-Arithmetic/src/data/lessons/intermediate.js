import { rectangle } from '../../game/generators/intermediate';
import { bars, dots, figure, numbers, pairs, rule, steps, sum, tip } from './blocks';

// Spell School lessons for Grades 4 to 6: one per maths topic.
export const INTERMEDIATE_LESSONS = {
  multiplication: {
    title: 'Multiplying',
    tagline: 'Groups, tables and splitting',
    hero: ['6', '×', '?'],
    badge: 'Table Tamer',
    learn: ['Times means groups of', 'Splitting into tens and ones', 'Bigger numbers', 'Checking your answer'],
    intro: 'Multiplying is a fast way of adding the same number again and again. Learn to split big numbers and no sum is too big.',
    pages: [
      {
        title: 'Groups of',
        blocks: [sum('3 × 4 = 12'), dots({ kind: 'groups', groups: 3, each: 4 }, '3 groups of 4 dots make 12')],
        orrin: '3 × 4 means 3 groups with 4 in each group. Count them all and you get 12. Your times tables are just these groups remembered.',
      },
      {
        title: 'Split it up',
        blocks: [steps(['Start', '6 × 24'], ['Step 1', '6 × 20 = 120', 'the tens'], ['Step 2', '6 × 4 = 24', 'the ones'], ['Answer', '120 + 24 = 144'])],
        orrin: 'Big numbers are easier in pieces. Split 24 into 20 and 4, multiply each part by 6, then add the answers together.',
      },
      {
        title: 'Two big numbers',
        blocks: [steps(['Start', '36 × 13'], ['Step 1', '36 × 10 = 360'], ['Step 2', '36 × 3 = 108'], ['Answer', '360 + 108 = 468']), tip('Tip: split the smaller number.')],
        orrin: 'For two big numbers, split the smaller one. 13 is 10 and 3, so work out 36 × 10 and 36 × 3, then add.',
      },
      {
        title: 'Check it',
        blocks: [pairs(['36 × 13', 'about 40 × 10 = 400'], ['468', 'close to 400 ✓'])],
        orrin: 'Round the numbers to guess the answer first. If your answer is close to your guess, you probably got it right.',
      },
    ],
    practice: 'Split the bigger number into parts that are easy to multiply.',
    done: 'Well done! Big times sums are no match for you now. Go and multiply your way up the tower!',
  },

  division: {
    title: 'Dividing',
    tagline: 'Sharing into equal groups',
    hero: ['84', '÷', '?'],
    badge: 'Fair Sharer',
    learn: ['Dividing means sharing', 'Using your times tables', 'Splitting big numbers', 'Checking with times'],
    intro: 'Dividing is sharing out fairly, so every group gets the same. It is the opposite of multiplying, so your tables will help you.',
    pages: [
      {
        title: 'Share it out',
        blocks: [sum('12 ÷ 3 = 4'), dots({ kind: 'groups', groups: 3, each: 4 }, '12 shared into 3 groups is 4 in each')],
        orrin: '12 ÷ 3 means: share 12 into 3 equal groups. Each group gets 4.',
      },
      {
        title: 'Tables backwards',
        blocks: [pairs(['×  ⇄  ÷', 'times undoes divide'], ['7 × 8 = 56', 'so 56 ÷ 7 = 8'])],
        orrin: 'Divide by asking a times question: how many 7s make 56? Your times table says 8.',
      },
      {
        title: 'Split it up',
        blocks: [steps(['Start', '84 ÷ 4'], ['Step 1', '80 ÷ 4 = 20'], ['Step 2', '4 ÷ 4 = 1'], ['Answer', '20 + 1 = 21'])],
        orrin: 'Split the big number into parts that share nicely. 84 is 80 and 4. Share each part, then add.',
      },
      {
        title: 'Check it',
        blocks: [steps(['Answer', '84 ÷ 4 = 21'], ['Check', '21 × 4 = 84  ✓'])],
        orrin: 'Always check a division with a times sum. If it takes you back to where you started, you got it right.',
      },
    ],
    practice: 'Ask yourself: how many of these fit into that number?',
    done: 'Excellent sharing! Every group gets its fair share now. The dividing floors are waiting for you.',
  },

  fractions: {
    title: 'Fractions',
    tagline: 'Parts of a whole',
    hero: ['½', 'of', '?'],
    badge: 'Fraction Finder',
    learn: ['What a fraction means', 'A fraction of a number', 'Adding fractions', 'Percentages and decimals'],
    intro: 'A fraction is a part of a whole. The bottom number says how many equal parts there are. The top says how many parts you take.',
    pages: [
      {
        title: 'What is a fraction?',
        blocks: [bars([4, 1, '1/4'], [4, 3, '3/4'], [8, 4, '4/8 = 1/2'])],
        orrin: 'Cut a bar into 4 equal parts. Shade 1 part: that is one quarter. Shade 3 parts: three quarters.',
      },
      {
        title: 'A fraction of a number',
        blocks: [steps(['Start', '3/4 of 24'], ['Step 1', '24 ÷ 4 = 6', 'one quarter'], ['Step 2', '6 × 3 = 18', 'three quarters'], ['Answer', '= 18'])],
        orrin: 'Divide by the bottom to find one part. Then multiply by the top to get how many parts you need.',
      },
      {
        title: 'Adding fractions',
        blocks: [bars([8, 3, '3/8'], [8, 2, '2/8'], [8, 5, '= 5/8']), rule('Same bottom? Add the tops. The bottom stays the same.')],
        orrin: 'When the bottoms are the same, the pieces are the same size. Just add the tops.',
      },
      {
        title: 'Percent & decimals',
        blocks: [pairs(['50%', '= 1/2'], ['25%', '= 1/4'], ['10%', '= 1/10'], ['0.5', '= 5 tenths']), steps(['Start', '25% of 80'], ['Step 1', '1/4 of 80 = 80 ÷ 4'], ['Answer', '= 20'])],
        orrin: 'Per cent means out of 100. 25% is the same as a quarter, so 25% of 80 is 80 shared into 4.',
      },
    ],
    practice: 'Look at the bottom number first: it tells you how many parts.',
    done: 'Fantastic! You can cut any whole into fair parts now. The fraction floors are ready for you.',
  },

  measurement: {
    title: 'Measuring',
    tagline: 'Perimeter, area and volume',
    hero: ['m', '·', '?'],
    badge: 'Tower Surveyor',
    learn: ['Perimeter goes around', 'Area covers', 'Volume fills', 'Changing units'],
    intro: 'Builders measure everything in the tower. Is it the distance around, the space it covers, or how much it holds?',
    pages: [
      {
        title: 'Perimeter',
        blocks: [figure(rectangle(8, 5, 'm')), steps(['Rule', 'add all four sides'], ['Step 1', '8 + 5 + 8 + 5'], ['Answer', '= 26 m'])],
        orrin: 'Perimeter is the distance all the way around a shape. Walk around the edge and add up every side.',
      },
      {
        title: 'Area',
        blocks: [figure(rectangle(8, 5, 'm')), steps(['Rule', 'length × breadth'], ['Step 1', '8 × 5'], ['Answer', '= 40 m²'])],
        orrin: 'Area is how many squares cover the shape. For a rectangle, multiply the length by the breadth. Area is measured in square units.',
      },
      {
        title: 'Volume',
        blocks: [steps(['Rule', 'length × breadth × height'], ['Step 1', '4 × 3 = 12', 'one layer of cubes'], ['Step 2', '12 × 2', '2 layers'], ['Answer', '= 24 cm³'])],
        orrin: 'Volume is how many cubes fill a box. Find how many cubes are in one layer, then times by the number of layers.',
      },
      {
        title: 'Changing units',
        blocks: [pairs(['1 m', '= 100 cm'], ['1 km', '= 1000 m'], ['1 kg', '= 1000 g'], ['1 l', '= 1000 ml']), tip('Big unit to small unit? Multiply.')],
        orrin: 'To change a big unit into a small one, multiply. 3 metres is 3 × 100 = 300 centimetres.',
      },
    ],
    practice: 'First decide: are you going around, covering, or filling?',
    done: 'Brilliant! You measure like a true tower builder. The measuring floors need your skills.',
  },

  patterns: {
    title: 'Number patterns',
    tagline: 'Find the rule',
    hero: ['3', '7', '?'],
    badge: 'Pattern Spotter',
    learn: ['Patterns that add', 'Patterns that take away', 'Patterns that multiply', 'Flow diagrams'],
    intro: 'A pattern is a line of numbers that follows a secret rule. Find the rule and you can find the next number.',
    pages: [
      {
        title: 'Adding patterns',
        blocks: [numbers([3, 7, 11, 15, '?'], ['+4', '+4', '+4', '+4'], 'The rule is “add 4”, so next is 19')],
        orrin: 'Look at how much each number grows. Here it grows by 4 every time, so the rule is add 4.',
      },
      {
        title: 'Going down',
        blocks: [numbers([52, 45, 38, 31, '?'], ['−7', '−7', '−7', '−7'], 'The rule is “subtract 7”, so next is 24')],
        orrin: 'If the numbers get smaller, the rule takes something away. Find how much goes each time.',
      },
      {
        title: 'Multiplying patterns',
        blocks: [numbers([2, 6, 18, 54, '?'], ['×3', '×3', '×3', '×3'], 'The rule is “multiply by 3”, so next is 162')],
        orrin: 'If the jumps get bigger and bigger, try multiplying. Each number here is 3 times the one before.',
      },
      {
        title: 'Flow diagrams',
        blocks: [steps(['Rule', '× 4 + 5'], ['Input', '7'], ['Step 1', '7 × 4 = 28'], ['Answer', '28 + 5 = 33'])],
        orrin: 'A flow diagram does the rule in order, left to right. Going backwards? Undo the steps in the opposite order.',
      },
    ],
    practice: 'How much does each number change? That is your rule.',
    done: 'Super! Patterns can’t hide their rules from you. The pattern floors are next.',
  },

  data: {
    title: 'Reading data',
    tagline: 'Mode, median and range',
    hero: ['5', '9', '?'],
    badge: 'Data Detective',
    learn: ['Putting data in order', 'The mode', 'The median', 'The range'],
    intro: 'Data is a list of numbers that tells a story. Put them in order first, and the story becomes clear.',
    pages: [
      {
        title: 'In order first',
        blocks: [numbers([9, 3, 7, 3, 5]), numbers([3, 3, 5, 7, 9], [], 'Smallest to biggest')],
        orrin: 'Before anything else, write the numbers from smallest to biggest. It makes every question easier.',
      },
      {
        title: 'The mode',
        blocks: [numbers([3, 3, 5, 7, 9], [], '3 appears twice, so the mode is 3'), rule('Mode = the number that appears most often.', 'REMEMBER')],
        orrin: 'The mode is the most common number. Mode sounds like most!',
      },
      {
        title: 'The median',
        blocks: [numbers([3, 3, 5, 7, 9], [], 'The middle number is 5'), tip('Even count? Find halfway between the middle two.')],
        orrin: 'The median is the middle number when they are in order. Cross off one from each end until one is left.',
      },
      {
        title: 'The range',
        blocks: [steps(['Biggest', '9'], ['Smallest', '3'], ['Answer', 'range = 9 − 3 = 6'])],
        orrin: 'The range shows how spread out the numbers are. Take the smallest away from the biggest.',
      },
    ],
    practice: 'Put the numbers in order first!',
    done: 'Great detective work! Data can’t keep its secrets from you now.',
  },
};

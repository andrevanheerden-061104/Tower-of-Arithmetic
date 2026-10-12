import { LESSON_FIGURES } from '../../game/generators/geometry';
import { bars, figure, numbers, orbs, pairs, rule, scale, steps, sum, tip } from './blocks';

// Spell School lessons for Grades 7 to 11: one per maths topic.
export const SENIOR_LESSONS = {
  algebra: {
    title: 'Solving for x',
    tagline: 'Unmask the mystery number',
    hero: ['x', '=', '?'],
    badge: 'Balance Keeper',
    learn: ['What x really means', 'Keeping the scale balanced', 'Undoing + and −', 'Undoing × and ÷', 'Two-step equations'],
    intro: 'Algebra is like a spell with a missing ingredient. The letter x is a number in disguise… and your job is to unmask it!',
    pages: [
      {
        title: 'What is x?',
        blocks: [sum('x + 3 = 7'), orbs({ box: true, count: 3 }, 7, 'x + 3 = 7  →  the box holds 4 orbs, so x = 4')],
        orrin: 'x is just a number we don’t know yet. Here, a box of orbs plus 3 more weighs the same as 7 orbs. How many orbs are hiding in the box?',
      },
      {
        title: 'Keep it balanced',
        blocks: [scale('x + 3', '7'), rule('Whatever you do to one side, you must do to the other.')],
        orrin: 'An equation is a magic scale. The equals sign means both sides weigh the same. Keep it balanced, and the answer will reveal itself.',
      },
      {
        title: 'Undo adding',
        blocks: [steps(['Start', 'x + 3 = 7'], ['Step 1', 'x + 3 − 3 = 7 − 3', '− 3 from both sides'], ['Answer', 'x = 4'], ['Check', '4 + 3 = 7  ✓'])],
        orrin: 'To get x alone, undo the + 3. The opposite of adding is taking away, so take 3 from both sides. Then check: put 4 back in. It works!',
      },
      {
        title: 'Undo times',
        blocks: [pairs(['+  ⇄  −', 'add undoes take away'], ['×  ⇄  ÷', 'times undoes divide']), steps(['Start', '2x = 10'], ['Step 1', '2x ÷ 2 = 10 ÷ 2', '÷ 2 on both sides'], ['Answer', 'x = 5'])],
        orrin: '2x means 2 times x. The opposite of times is divide, so divide both sides by 2. Every spell has an opposite that undoes it.',
      },
      {
        title: 'Two-step spells',
        blocks: [steps(['Start', '2x − 4 = 10'], ['Step 1', '2x = 10 + 4  →  2x = 14', '+ 4 on both sides'], ['Step 2', 'x = 14 ÷ 2', '÷ 2 on both sides'], ['Answer', 'x = 7']), tip('Tip: undo + and − first, then × and ÷.')],
        orrin: 'Bigger spells take two steps. First undo the − 4, then undo the times 2. This is exactly how you cast spells in the tower!',
      },
    ],
    practice: 'Undo the + or − first, then the × or ÷. Tap the light bulb if you get stuck.',
    done: 'Well done, apprentice! You can unmask x now. Go and try it on the monsters of the tower. The algebra floors are waiting.',
  },

  geometry: {
    title: 'Finding angles',
    tagline: 'Every angle follows a rule',
    hero: ['∠', '=', '?'],
    badge: 'Angle Seer',
    learn: ['The three big angle rules', 'Angles on a straight line', 'Angles in a triangle', 'Parallel lines', 'Writing the reason'],
    intro: 'Geometry spells are hidden in shapes. Every missing angle follows a rule, and once you know the rule, the angle has nowhere to hide.',
    pages: [
      {
        title: 'The big three',
        blocks: [pairs(['180°', 'angles on a straight line'], ['180°', 'angles in a triangle'], ['360°', 'angles around a point']), rule('Name the rule first, then write it as an equation.', 'THE GOLDEN RULE')],
        orrin: 'Three numbers do most of the work: 180, 180 and 360. Learn which shape goes with which number and you can find almost any angle.',
      },
      {
        title: 'On a straight line',
        blocks: [figure(LESSON_FIGURES.line()), steps(['Rule', 'x + 130° = 180°', 'angles on a straight line'], ['Step 1', 'x = 180° − 130°'], ['Answer', 'x = 50°'])],
        orrin: 'The angles on a straight line add up to 180°. We know one is 130°, so x is what is left over: 180 take away 130.',
      },
      {
        title: 'In a triangle',
        blocks: [figure(LESSON_FIGURES.triangle()), steps(['Rule', 'x + 60° + 70° = 180°', 'angles in a triangle'], ['Step 1', 'x + 130° = 180°'], ['Answer', 'x = 50°'])],
        orrin: 'The three angles inside any triangle add up to 180°. Add the two you know, then take that away from 180.',
      },
      {
        title: 'Parallel lines',
        blocks: [figure(LESSON_FIGURES.parallel()), pairs(['F shape', 'corresponding: equal'], ['Z shape', 'alternate: equal'], ['C shape', 'co-interior: add to 180°']), steps(['Answer', 'x = 65°', 'corresponding angles'])],
        orrin: 'When a line cuts two parallel lines, look for an F, a Z or a C. F and Z angles are equal. C angles add up to 180°.',
      },
    ],
    practice: 'Say the rule to yourself first: is it a line, a triangle, a point or parallel lines?',
    done: 'Splendid! Angles can’t hide from you now. The geometry floors draw their shapes to scale, so use your eyes and your rules.',
  },

  fractions: {
    title: 'Fraction magic',
    tagline: 'Parts of a whole',
    hero: ['¾', '+', '?'],
    badge: 'Fraction Weaver',
    learn: ['Adding with the same bottom', 'Finding a common bottom', 'Multiplying fractions', 'Dividing: flip and multiply', 'Simplifying'],
    intro: 'A fraction is a whole cut into equal pieces. The bottom number says how many pieces, the top says how many you have. Let’s learn to mix them.',
    pages: [
      {
        title: 'Same bottom',
        blocks: [bars([8, 3, '3/8'], [8, 2, '2/8'], [8, 5, '3/8 + 2/8 = 5/8']), rule('Same bottom? Add the tops. The bottom stays the same.')],
        orrin: 'When the pieces are the same size, you just count them. 3 eighths and 2 eighths make 5 eighths. The bottom never changes when you add.',
      },
      {
        title: 'Different bottoms',
        blocks: [steps(['Start', '1/2 + 1/3'], ['Step 1', '3/6 + 2/6', 'make both bottoms 6'], ['Answer', '= 5/6'])],
        orrin: 'Halves and thirds are different-sized pieces, so first cut both into sixths. Find the smallest number both bottoms go into.',
      },
      {
        title: 'Multiplying',
        blocks: [steps(['Start', '2/3 × 3/5'], ['Step 1', '= (2 × 3)/(3 × 5)', 'tops × tops, bottoms × bottoms'], ['Step 2', '= 6/15'], ['Answer', '= 2/5', 'divide top and bottom by 3'])],
        orrin: 'Multiplying is the easy one: tops times tops, bottoms times bottoms. Then simplify by dividing the top and bottom by the same number.',
      },
      {
        title: 'Dividing',
        blocks: [pairs(['÷ 1/2', 'is the same as × 2'], ['÷ 3/4', 'is the same as × 4/3']), steps(['Start', '3/4 ÷ 1/8'], ['Step 1', '= 3/4 × 8/1', 'flip the second fraction'], ['Answer', '= 24/4 = 6'])],
        orrin: 'To divide by a fraction, flip it over and multiply. Keep, change, flip: keep the first, change ÷ to ×, flip the second.',
      },
    ],
    practice: 'Look at the bottoms first. Then remember: always give the simplest form.',
    done: 'Wonderful! Fractions bend to your will now. Remember to simplify every answer before you cast it.',
  },

  arithmetic: {
    title: 'Order & integers',
    tagline: 'Brackets first, signs always',
    hero: ['(', '−', ')'],
    badge: 'Sign Master',
    learn: ['The order of operations', 'Adding and subtracting negatives', 'Multiplying negatives', 'Powers, roots and exponent laws'],
    intro: 'Big sums must be worked out in the right order, and minus signs love to cause trouble. Master both and no sum can trick you.',
    pages: [
      {
        title: 'The right order',
        blocks: [pairs(['1  ( )', 'brackets'], ['2  x²  √', 'powers and roots'], ['3  ×  ÷', 'left to right'], ['4  +  −', 'left to right']), steps(['Start', '4 + 3 × 6'], ['Step 1', '= 4 + 18', '× before +'], ['Answer', '= 22'])],
        orrin: 'Brackets first, then powers, then times and divide, then add and take away. 4 + 3 × 6 is 22, not 42!',
      },
      {
        title: 'Negative numbers',
        blocks: [numbers([-3, -2, -1, 0, 1, 2, 3], [], 'Below zero the numbers get smaller as they get further away'), pairs(['− (−5)', 'becomes + 5'], ['−7 + 12', '= 5'])],
        orrin: 'Think of a ladder that goes below the ground. Taking away a negative is the same as adding. Two minus signs side by side become a plus.',
      },
      {
        title: 'Times and divide',
        blocks: [pairs(['+ × +', '= +'], ['− × −', '= +'], ['+ × −', '= −'], ['− × +', '= −']), steps(['Start', '−3 × (4 − 9)'], ['Step 1', '= −3 × (−5)', 'brackets first'], ['Answer', '= 15', '− × − = +'])],
        orrin: 'When you multiply or divide: same signs give a plus, different signs give a minus.',
      },
      {
        title: 'Powers',
        blocks: [pairs(['2³ × 2²', '= 2⁵  add the powers'], ['2⁵ ÷ 2³', '= 2²  subtract'], ['(3²)²', '= 3⁴  multiply'], ['2^(−3)', '= 1/8  one over']), tip('Same base? Then the laws work.')],
        orrin: 'A power is quick multiplying: 2³ is 2 × 2 × 2. When the bases match, the exponent laws save you a lot of work.',
      },
    ],
    practice: 'Work out the brackets first, and watch every minus sign.',
    done: 'Excellent! Signs and brackets bow to you now. Keep each step on its own line and you won’t slip.',
  },

  patterns: {
    title: 'Number patterns',
    tagline: 'Find the rule, find any term',
    hero: ['Tₙ', '=', '?'],
    badge: 'Pattern Reader',
    learn: ['The constant difference', 'Writing the rule Tₙ', 'Finding any term', 'Finding which term', 'Quadratic patterns'],
    intro: 'Every pattern in the tower has a secret rule. Find the rule and you can see a hundred steps ahead without counting.',
    pages: [
      {
        title: 'The difference',
        blocks: [numbers([3, 7, 11, 15, '?'], ['+4', '+4', '+4', '+4'], 'The difference is always 4, so the next term is 19')],
        orrin: 'Look at what changes from one term to the next. If it is always the same, it is called the constant difference.',
      },
      {
        title: 'Write the rule',
        blocks: [steps(['Pattern', '3, 7, 11, 15, …'], ['Step 1', 'difference = 4  →  4n', 'the difference goes in front of n'], ['Step 2', 'T₁ = 4(1) + ? = 3  →  − 1', 'make term 1 work'], ['Answer', 'Tₙ = 4n − 1'])],
        orrin: 'The difference goes in front of n. Then fix the number on the end so that the first term comes out right.',
      },
      {
        title: 'Any term, any place',
        blocks: [steps(['Find', 'T₂₀ of Tₙ = 4n − 1'], ['Step 1', 'T₂₀ = 4(20) − 1', 'put n = 20'], ['Answer', '= 79']), steps(['Which term is 59?', '4n − 1 = 59'], ['Step 1', '4n = 60'], ['Answer', 'n = 15'])],
        orrin: 'To find a term, put its number in for n. To find which term a number is, set the rule equal to it and solve, just like algebra.',
      },
      {
        title: 'Quadratic patterns',
        blocks: [numbers([2, 4, 8, 14, '?'], ['+2', '+4', '+6', '+8'], 'The differences grow by 2 each time (the second difference)'), tip('Constant second difference? It is a quadratic pattern.')],
        orrin: 'Some patterns grow faster. If the differences themselves go up by the same amount, keep that going to find the next term.',
      },
    ],
    practice: 'Find the difference first, then use it to build the rule.',
    done: 'Marvellous! You can see the shape of any pattern now. The pattern floors hold no secrets from you.',
  },

  data: {
    title: 'Reading data',
    tagline: 'Mean, median, mode and more',
    hero: ['Σ', '÷', 'n'],
    badge: 'Data Oracle',
    learn: ['The mean', 'The median', 'The mode and range', 'Quartiles and the IQR', 'Spread: variance and σ'],
    intro: 'Data tells a story. A few numbers can tell you what is normal, what is in the middle and how spread out everything is.',
    pages: [
      {
        title: 'The mean',
        blocks: [numbers([4, 7, 9, 12, 8]), steps(['Step 1', 'sum = 4 + 7 + 9 + 12 + 8 = 40', 'add them all'], ['Step 2', '40 ÷ 5', 'divide by how many'], ['Answer', 'mean = 8'])],
        orrin: 'The mean shares everything out equally. Add all the values, then divide by how many values there are.',
      },
      {
        title: 'Median & mode',
        blocks: [numbers([2, 4, 5, 5, 9], [], 'In order first! The middle value is 5'), pairs(['median', 'the middle value in order'], ['mode', 'the value that appears most'], ['range', 'biggest − smallest'])],
        orrin: 'Always put the numbers in order first. The median is the one in the middle. With an even count, find halfway between the middle two.',
      },
      {
        title: 'Quartiles',
        blocks: [numbers([7, 14, 21, 28, 33, 36, 49], [], 'Q1 = 14 · median = 28 · Q3 = 36'), steps(['IQR', 'Q3 − Q1 = 36 − 14'], ['Answer', '= 22'])],
        orrin: 'The median splits the data in half. The middle of the lower half is Q1, the middle of the upper half is Q3. Their gap is the interquartile range.',
      },
      {
        title: 'Spread',
        blocks: [steps(['Data', '24, 14, 18, 20  (mean 19)'], ['Step 1', 'differences²: 25, 25, 1, 1', 'how far from the mean, squared'], ['Step 2', 'variance = 52 ÷ 4 = 13'], ['Answer', 'σ = √13', 'standard deviation'])],
        orrin: 'Variance tells you how spread out the data is. Square each distance from the mean, find their mean, and the square root is σ.',
      },
    ],
    practice: 'Put the numbers in order first, then decide what the question asks for.',
    done: 'Superb! Numbers tell you their secrets now. The data floors are yours to read.',
  },
};

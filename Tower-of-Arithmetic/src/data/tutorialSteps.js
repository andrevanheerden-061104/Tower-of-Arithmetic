// ---------------------------------------------------------------------------
// The tutorial: Orrin, the old Archmage, walks the player through the game
// one step at a time. It teaches how the game works, not the maths.
//
// Each step shows one of the real screens (`scene`) with a spotlight on the
// part being explained (`targets`, the ids of <TutorialTarget> marks in the
// screens):
//   scene    home | map | combat | cast | reward | chooseSpell | deck |
//            puzzle | mystery | shop | rest | removeCurse | boss
//   targets  ids to light up (each gets its own spotlight)
//   union    true = one spotlight round all the targets together
//   voice    the recording of the line (src/assets/vioces/tutorial)
//   text     what Orrin says. It must match the recording word for word:
//            the words light up as they're spoken.
//   only     only show the step in these versions
//
// After changing a recording or its text, run
//   python scripts/voice-timings.py
// to work out again when each word is spoken (tutorialVoiceTimings.js).
//
// Junior mode (Grades 1-3) has its own shorter steps in simpler words, and
// leaves out coins, the trader, potions, items and curses.
// ---------------------------------------------------------------------------

import { TIMINGS } from './tutorialVoiceTimings';

// The recordings, by name (metro needs each require written out).
const VOICES = {
  std_01: require('../assets/vioces/tutorial/Standard tutorial/std_01.mp3'),
  std_02: require('../assets/vioces/tutorial/Standard tutorial/std_02.mp3'),
  std_03: require('../assets/vioces/tutorial/Standard tutorial/std_03.mp3'),
  std_04: require('../assets/vioces/tutorial/Standard tutorial/std_04.mp3'),
  std_05: require('../assets/vioces/tutorial/Standard tutorial/std_05.mp3'),
  std_06: require('../assets/vioces/tutorial/Standard tutorial/std_06.mp3'),
  std_07: require('../assets/vioces/tutorial/Standard tutorial/std_07.mp3'),
  std_08: require('../assets/vioces/tutorial/Standard tutorial/std_08.mp3'),
  std_09: require('../assets/vioces/tutorial/Standard tutorial/std_09.mp3'),
  std_10: require('../assets/vioces/tutorial/Standard tutorial/std_10.mp3'),
  std_11: require('../assets/vioces/tutorial/Standard tutorial/std_11.mp3'),
  std_12: require('../assets/vioces/tutorial/Standard tutorial/std_12.mp3'),
  std_13: require('../assets/vioces/tutorial/Standard tutorial/std_13.mp3'),
  std_14: require('../assets/vioces/tutorial/Standard tutorial/std_14.mp3'),
  std_15: require('../assets/vioces/tutorial/Standard tutorial/std_15.mp3'),
  std_16: require('../assets/vioces/tutorial/Standard tutorial/std_16.mp3'),
  std_17: require('../assets/vioces/tutorial/Standard tutorial/std_17.mp3'),
  std_18: require('../assets/vioces/tutorial/Standard tutorial/std_18.mp3'),
  std_19: require('../assets/vioces/tutorial/Standard tutorial/std_19.mp3'),
  std_20: require('../assets/vioces/tutorial/Standard tutorial/std_20.mp3'),
  std_21: require('../assets/vioces/tutorial/Standard tutorial/std_21.mp3'),
  jr_01: require('../assets/vioces/tutorial/Junior tutorial/jr_01.mp3'),
  jr_02: require('../assets/vioces/tutorial/Junior tutorial/jr_02.mp3'),
  jr_03: require('../assets/vioces/tutorial/Junior tutorial/jr_03.mp3'),
  jr_04: require('../assets/vioces/tutorial/Junior tutorial/jr_04.mp3'),
  jr_05: require('../assets/vioces/tutorial/Junior tutorial/jr_05.mp3'),
  jr_06: require('../assets/vioces/tutorial/Junior tutorial/jr_06.mp3'),
  jr_07: require('../assets/vioces/tutorial/Junior tutorial/jr_07.mp3'),
  jr_08: require('../assets/vioces/tutorial/Junior tutorial/jr_08.mp3'),
  jr_09: require('../assets/vioces/tutorial/Junior tutorial/jr_09.mp3'),
  jr_10: require('../assets/vioces/tutorial/Junior tutorial/jr_10.mp3'),
  jr_11: require('../assets/vioces/tutorial/Junior tutorial/jr_11.mp3'),
  jr_12: require('../assets/vioces/tutorial/Junior tutorial/jr_12.mp3'),
  jr_13: require('../assets/vioces/tutorial/Junior tutorial/jr_13.mp3'),
  jr_14: require('../assets/vioces/tutorial/Junior tutorial/jr_14.mp3'),
  jr_15: require('../assets/vioces/tutorial/Junior tutorial/jr_15.mp3'),
  jr_16: require('../assets/vioces/tutorial/Junior tutorial/jr_16.mp3'),
  jr_17: require('../assets/vioces/tutorial/Junior tutorial/jr_17.mp3'),
};

const STANDARD_STEPS = [
  {
    scene: 'home',
    voice: 'std_01',
    text: "Welcome, young apprentice. I am Orrin, Archmage of this tower. Before you climb, let me show you how everything works.",
  },
  {
    scene: 'home',
    targets: ['newRun'],
    voice: 'std_02',
    text: "Tap New run to begin a climb. The tower rebuilds itself every time, so no two climbs are ever the same.",
  },
  {
    scene: 'map',
    targets: ['mapNext'],
    voice: 'std_03',
    text: "This is the tower map. The glowing rooms are the ones you can reach next. Choose one, then tap Enter floor.",
  },
  {
    scene: 'map',
    targets: ['mapLegend'],
    voice: 'std_04',
    text: "Each icon is a different room: fights, puzzles, mystery events, the trader, and a campfire to rest. The boss waits at the very top.",
  },
  {
    scene: 'combat',
    targets: ['spellHand'],
    voice: 'std_05',
    text: "In a fight, your spells are cards. Tap a card to begin casting it.",
  },
  {
    scene: 'cast',
    targets: ['castHeader', 'castQuestion'],
    union: true,
    voice: 'std_06',
    text: "Solve the sum to power your spell. Right answer… and it strikes! Wrong answer… and it fizzles. But don't worry. I'll show you where it went wrong.",
  },
  {
    scene: 'cast',
    targets: ['hintButton'],
    voice: 'std_07',
    text: "Stuck? Tap the lightbulb and I'll give you a hint. It is always wiser to ask than to guess.",
  },
  {
    scene: 'combat',
    targets: ['playerHealth', 'enemyHealth'],
    union: true,
    voice: 'std_08',
    text: "A roll of the dice decides who goes first. Then you and the enemy take turns. The glowing name shows whose turn it is.",
  },
  {
    scene: 'combat',
    targets: ['playerHealth'],
    voice: 'std_09',
    text: "These are your hearts. Enemies will try to take them, and they don't refill between fights. If they run out, your climb is over.",
  },
  {
    scene: 'combat',
    targets: ['potions', 'items'],
    voice: 'std_10',
    text: "Potions on the left can be used once. Tap one to drink it. Items on the right help you all the time, no tapping needed.",
  },
  {
    scene: 'combat',
    targets: ['enemy'],
    voice: 'std_11',
    text: "Every enemy hides a weakness to one element. Strike it with the right spell for a Critical hit that does double damage. Try your spells, and find out!",
  },
  {
    scene: 'reward',
    targets: ['spellReward'],
    voice: 'std_12',
    text: "After you win, choose a new spell before you climb on. Tap here to see three cards.",
  },
  {
    scene: 'chooseSpell',
    targets: ['spellCard'],
    voice: 'std_13',
    text: "Each card shows its element, level and damage. The cards you find are random… but defeat a boss, and you'll earn a legendary card.",
  },
  {
    scene: 'deck',
    targets: ['deckGrid'],
    voice: 'std_14',
    text: "Your deck holds up to 5 cards. Those are the spells you fight with. Extra cards wait in your stash. Open Deck from the menu to swap them.",
  },
  {
    scene: 'puzzle',
    targets: ['puzzle'],
    voice: 'std_15',
    text: "Puzzle rooms have no enemy. Solve the puzzle to open the way and earn your reward.",
  },
  {
    scene: 'mystery',
    targets: ['gifts'],
    voice: 'std_16',
    text: "In a mystery room, anything can happen. You might find a strange event, or be offered a choice of gifts. You may only take one, so read carefully… some carry a drawback.",
  },
  {
    scene: 'shop',
    targets: ['wares'],
    voice: 'std_17',
    text: "Fights give you coins. Spend them at the trader on potions, items and new spell cards.",
  },
  {
    scene: 'rest',
    targets: ['restChoices'],
    voice: 'std_18',
    text: "At a campfire you choose one thing: rest to get 1 heart back, or burn away a curse.",
  },
  {
    scene: 'removeCurse',
    targets: ['curseList'],
    voice: 'std_19',
    text: "Some strong items and spells carry a curse, like losing half a heart every floor. A campfire can burn one curse away… but then you don't get to rest.",
  },
  {
    scene: 'boss',
    targets: ['enemy'],
    voice: 'std_20',
    text: "At the very top waits the boss of the tower. Bosses hit hard and some can even heal, so keep your hearts up. Defeat the boss to clear the tower!",
  },
  {
    scene: 'home',
    voice: 'std_21',
    text: "One last thing. Your cards only last for this climb. When it ends, you begin again with your first spell. Now then… are you ready? Let's climb!",
  },
];

const JUNIOR_STEPS = [
  { scene: 'home', voice: 'jr_01', text: "Hello, little wizard! I'm Orrin. Let's learn how to play!" },
  { scene: 'home', targets: ['newRun'], voice: 'jr_02', text: "Tap New run to go into the tower." },
  { scene: 'map', targets: ['mapNext'], voice: 'jr_03', text: "Pick a glowing room to go in next." },
  { scene: 'map', targets: ['mapLegend'], voice: 'jr_04', text: "Each picture is a room. Swords mean a fight. The crown is the big boss at the top!" },
  { scene: 'combat', targets: ['spellHand'], voice: 'jr_05', text: "To fight a monster, tap a spell card." },
  { scene: 'cast', targets: ['answers'], voice: 'jr_06', text: "Tap the right answer to use your spell!" },
  { scene: 'cast', targets: ['readAloud'], voice: 'jr_07', text: "Tap the speaker, and I'll read it to you." },
  { scene: 'cast', targets: ['helpMe'], voice: 'jr_08', text: "Not sure? Tap Help me, and I'll give you a clue." },
  { scene: 'combat', targets: ['playerHealth'], voice: 'jr_09', text: "These are your hearts. The monster can take them away. Keep them safe!" },
  { scene: 'combat', targets: ['enemy'], voice: 'jr_10', text: "You and the monster take turns. Some spells hurt some monsters extra. Try them all!" },
  { scene: 'reward', targets: ['spellReward'], voice: 'jr_11', text: "You won! Now pick a new spell card to keep." },
  { scene: 'deck', targets: ['deckGrid'], voice: 'jr_12', text: "Your 5 best cards go in your deck. More cards wait in your stash." },
  { scene: 'puzzle', targets: ['puzzle'], voice: 'jr_13', text: "In a puzzle room, find what comes next to open the door." },
  { scene: 'mystery', targets: ['gifts'], voice: 'jr_14', text: "In a surprise room, something special happens. Pick the present you like best!" },
  { scene: 'rest', targets: ['restChoices'], voice: 'jr_15', text: "Sit by the campfire to get a heart back." },
  { scene: 'boss', targets: ['enemy'], voice: 'jr_16', text: "At the very top is the big boss of the tower. Beat the boss to win!" },
  { scene: 'home', voice: 'jr_17', text: "Your spell cards are just for this climb. Ready? Let's go!" },
];

// The steps for the player's version, each with its recording (`audio`)
// and when each word is spoken (`wordStarts`, seconds, one per word).
export function tutorialSteps(version) {
  const junior = version.id === 'junior';
  const steps = junior ? JUNIOR_STEPS : STANDARD_STEPS;
  return steps
    .filter((step) => !step.only || step.only.includes(version.id))
    .map((step) => ({
      ...step,
      targets: step.targets ?? [],
      audio: VOICES[step.voice] ?? null,
      wordStarts: TIMINGS[step.voice] ?? null,
    }));
}

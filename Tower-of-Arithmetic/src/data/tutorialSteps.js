// ---------------------------------------------------------------------------
// The tutorial: Nyxara walks the player through the game, one step at a time.
// It teaches how the game works, not the maths.
//
// Each step shows one of the real screens (`scene`) with a spotlight on the
// part being explained (`targets`, the ids of <TutorialTarget> marks in the
// screens):
//   scene         home | map | combat | cast | reward | chooseSpell | deck |
//                 puzzle | mystery | shop | rest | removeCurse | boss
//   targets       ids to light up (each gets its own spotlight)
//   union         true = one spotlight round all the targets together
//   text          what Nyxara says
//   textNoCurses  what she says instead in versions without curses
//   only          only show the step in these versions
//
// Junior mode (Grades 1-3) has its own shorter steps in simpler words, and
// leaves out coins, the trader, potions, items and curses.
// ---------------------------------------------------------------------------

const STANDARD_STEPS = [
  {
    scene: 'home',
    text: "Welcome, apprentice! I'm Nyxara. Before you climb the Tower of Arithmetic, let me show you how everything works.",
  },
  {
    scene: 'home',
    targets: ['newRun'],
    text: 'Tap New run to start a climb. Every run builds a brand-new tower, so no two climbs are the same.',
  },
  {
    scene: 'map',
    targets: ['mapNext'],
    text: 'This is the tower map. The glowing rooms are the ones you can reach next. Pick one, then tap Enter floor.',
  },
  {
    scene: 'map',
    targets: ['mapLegend'],
    text: 'Each icon is a different room: fights, puzzles, mystery events, the trader and a campfire to rest. The boss waits at the very top.',
  },
  {
    scene: 'combat',
    targets: ['spellHand'],
    text: 'In a fight, your spells are cards. Tap a card to start casting it.',
  },
  {
    scene: 'cast',
    targets: ['castHeader', 'castQuestion'],
    union: true,
    text: 'Solve the sum to power your spell. Right answer: it hits! Wrong answer: it fizzles, and the Archmage shows you where it went wrong.',
  },
  {
    scene: 'cast',
    targets: ['hintButton'],
    text: "Stuck? Tap the lightbulb for a hint. It's always better to ask than to guess.",
  },
  {
    scene: 'combat',
    targets: ['playerHealth', 'enemyHealth'],
    union: true,
    text: 'A dice roll decides who goes first. Then you and the enemy take turns. The glowing name shows whose turn it is.',
  },
  {
    scene: 'combat',
    targets: ['playerHealth'],
    text: "These are your hearts. Enemies take them away, and they don't refill between fights. If they run out, the run is over.",
  },
  {
    scene: 'combat',
    targets: ['potions', 'items'],
    text: 'Potions on the left can be used once: tap one to drink it. Items on the right help you all the time, no tapping needed.',
  },
  {
    scene: 'combat',
    targets: ['enemy'],
    text: 'Every enemy has a secret weakness to one element. Hit it with the right spell for a Critical hit that does double damage. Try your spells to find out!',
  },
  {
    scene: 'reward',
    targets: ['spellReward'],
    text: 'After you win, choose a new spell before you climb on. Tap here to see three cards.',
  },
  {
    scene: 'chooseSpell',
    targets: ['spellCard'],
    text: 'Each card shows its element, level and damage. The cards you are offered are random, but legendary cards can only be won by defeating a boss!',
  },
  {
    scene: 'deck',
    targets: ['deckGrid'],
    text: 'Your deck holds up to 5 cards. Those are the spells you fight with. Extra cards wait in your stash: open Deck from the menu to swap them.',
  },
  {
    scene: 'puzzle',
    targets: ['puzzle'],
    text: 'Puzzle rooms have no enemy. Solve the puzzle to open the way and earn your reward.',
  },
  {
    scene: 'mystery',
    targets: ['gifts'],
    text: 'In a mystery room, a ghost offers you a gift. You can only take one, so read carefully: some gifts have a drawback.',
    textNoCurses: 'In a mystery room, a ghost offers you a gift. You can only take one, so choose carefully.',
  },
  {
    scene: 'shop',
    targets: ['wares'],
    text: 'Fights give you coins. Spend them at the trader on potions, items and new spell cards.',
  },
  {
    scene: 'rest',
    targets: ['restChoices'],
    text: 'At a campfire you choose one thing: rest to get 1 heart back, or burn away a curse.',
    textNoCurses: 'At a campfire you can rest to get 1 heart back before you climb on.',
  },
  {
    scene: 'removeCurse',
    targets: ['curseList'],
    only: ['senior'],
    text: "Some strong items and spells carry a curse, like losing ½ heart every floor. A campfire can burn one curse away, but then you don't get to rest.",
  },
  {
    scene: 'boss',
    targets: ['enemy'],
    text: 'At the top waits Morvath, the Shadow Warden. He hits hard and can heal, so keep your hearts up. Beat him to clear the tower!',
  },
  {
    scene: 'home',
    text: "One last thing: your cards only last for this run. When it ends, you start again with your first spell. Ready? Let's climb!",
  },
];

const JUNIOR_STEPS = [
  { scene: 'home', text: "Hi! I'm Nyxara. Let's learn how to play!" },
  { scene: 'home', targets: ['newRun'], text: 'Tap New run to go into the tower.' },
  { scene: 'map', targets: ['mapNext'], text: 'Pick a glowing room to go in next.' },
  { scene: 'map', targets: ['mapLegend'], text: 'Each picture is a room. Swords mean a fight. The crown is the big boss at the top!' },
  { scene: 'combat', targets: ['spellHand'], text: 'To fight a monster, tap a spell card.' },
  { scene: 'cast', targets: ['answers'], text: 'Tap the right answer to use your spell!' },
  { scene: 'cast', targets: ['readAloud'], text: "Tap the speaker and I'll read it to you." },
  { scene: 'cast', targets: ['helpMe'], text: 'Not sure? Tap Help me for a clue.' },
  { scene: 'combat', targets: ['playerHealth'], text: 'These are your hearts. The monster can take them away. Keep them safe!' },
  { scene: 'combat', targets: ['enemy'], text: 'You and the monster take turns. Some spells hurt some monsters extra. Try them all!' },
  { scene: 'reward', targets: ['spellReward'], text: 'You won! Now pick a new spell card to keep.' },
  { scene: 'deck', targets: ['deckGrid'], text: 'Your 5 best cards go in your deck. More cards wait in your stash.' },
  { scene: 'puzzle', targets: ['puzzle'], text: 'In a puzzle room, find what comes next to open the door.' },
  { scene: 'mystery', targets: ['gifts'], text: 'A friendly ghost has presents. Pick the one you like best!' },
  { scene: 'rest', targets: ['restChoices'], text: 'Sit by the campfire to get a heart back.' },
  { scene: 'boss', targets: ['enemy'], text: 'At the top is the big boss, Morvath. Beat him to win!' },
  { scene: 'home', text: "Your spell cards are just for this climb. Ready? Let's go!" },
];

// The steps for the player's version, with the right words for it.
export function tutorialSteps(version) {
  const steps = version.id === 'junior' ? JUNIOR_STEPS : STANDARD_STEPS;
  return steps
    .filter((step) => !step.only || step.only.includes(version.id))
    .map((step) => ({
      ...step,
      targets: step.targets ?? [],
      text: !version.usesCurses && step.textNoCurses ? step.textNoCurses : step.text,
    }));
}

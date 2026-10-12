import { createRun, makeReward, makeSpellOffers } from '../game/run';

// Made-up runs for the tutorial, so the real screens can be shown with
// something in them: three spells in the deck, one in the stash, and the
// player standing in the right kind of room for each screen.

const DEMO_SPELLS = ['flashflame', 'flashFreeze', 'shadowShard', 'flash'];

// Which kind of room the player stands in for each tutorial screen.
const ROOM_FOR_SCENE = {
  combat: 'combat',
  cast: 'combat',
  reward: 'combat',
  chooseSpell: 'combat',
  deck: 'combat',
  puzzle: 'puzzle',
  mystery: 'mystery',
  shop: 'shop',
  rest: 'rest',
  removeCurse: 'rest',
  boss: 'boss',
};

export function makeDemoRun(version, character, scene) {
  let run = createRun({ version, dungeonTypeId: 'mixed', character });
  const starter = run.deck[0];
  run = { ...run, deck: [starter, ...DEMO_SPELLS.filter((id) => id !== starter).slice(0, 2)], stash: ['azureBlaze'] };
  // A couple of items to point at (a cursed one where the version has curses)
  if (version.usesCoins) run = { ...run, items: version.usesCurses ? ['frostwardRing', 'cursedScroll'] : ['frostwardRing', 'sharpenedScroll'] };

  const type = ROOM_FOR_SCENE[scene];
  if (type) {
    const rooms = Object.values(run.map.nodes).sort((a, b) => a.floor - b.floor);
    const room = rooms.find((n) => n.type === type) ?? rooms.find((n) => n.type === 'combat');
    run = { ...run, currentId: room.id };
  }
  // The fight is over on these screens (the deck can only be changed then)
  if (scene === 'reward' || scene === 'chooseSpell' || scene === 'deck') {
    run = { ...run, cleared: [...run.cleared, run.currentId] };
  }
  if (scene === 'reward') run = { ...run, reward: makeReward(run, 'combat') };
  if (scene === 'chooseSpell') run = { ...run, offers: makeSpellOffers(run) };
  return run;
}

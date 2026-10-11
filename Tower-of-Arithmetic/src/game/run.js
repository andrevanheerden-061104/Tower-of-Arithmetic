import { levelBonus } from '../data/characterLevels';
import { ENEMIES, ITEMS } from './encounters';
import { pickEnemyId } from './enemyAI';
import { gradeFor } from './generators';
import { generateMap } from './mapGenerator';
import { newSeed } from './random';
import { REWARD_ROOMS, ROOMS } from './rooms';
import { MAX_DECK, spellOffers } from './spells';
import { VERSIONS } from './versions';

// ---------------------------------------------------------------------------
// The current run (one climb of the tower).
//
// App.js keeps the run in state and hands it to the tower screens. Screens
// never change it directly: they call updateRun(fn) with one of the helpers
// below, which each return a NEW run object. Nothing is saved to the phone
// or a server yet, so a run is lost when the app closes.
// ---------------------------------------------------------------------------

export function createRun({ version, dungeonTypeId, character, grade }) {
  const seed = newSeed();
  // Rewards from the character's level (e.g. +1 heart at level 5)
  const bonus = levelBonus(character?.level ?? 1);
  const hearts = version.hearts + bonus.maxHearts;
  return {
    versionId: version.id,
    // The player's school grade: every sum in the run is made for it
    grade: gradeFor(version.id, grade),
    // The maths topic chosen for this run ('mixed' = all of them). Every
    // spell and every puzzle door asks sums from it.
    dungeonTypeId,
    seed,
    map: generateMap({ floors: version.floors, seed, roomTypes: version.rooms }),
    currentId: 'start',  // the room the player is in (start = tower gate)
    cleared: ['start'],
    hearts,
    maxHearts: hearts,
    coins: version.startCoins,
    xp: 0,
    // The player starts with only their character's level 1 card and
    // collects the rest on the way up. Up to 5 cards are in the deck (used
    // in fights); any more go to the stash and can be swapped in on the
    // Deck screen. Cards belong to this run only and are gone when it ends.
    deck: [character?.starter ?? 'shadowShard'],
    stash: [],
    offers: null,   // the spells on offer in the spell picker
    potions: version.usesPotions ? ['heal', 'power'] : [],
    items: version.usesCurses ? ['luckyGem', 'hauntedRing'] : version.usesCoins ? ['luckyGem'] : [],
    cleansed: [],   // items whose curse was removed at a campfire
    stats: { solved: 0, hints: 0, errors: 0, streak: 0, bestStreak: 0, floors: [] },
    // Per maths topic: { attempts, correct, timeMs, hints } (for Orrin's
    // end-of-run summary)
    topicStats: {},
    // The sums the player got wrong: { topic, level, display, answer, given }
    // (the last 12, for Orrin's summary)
    mistakes: [],
    // AI sums for this run, by topic and difficulty level (null until they
    // arrive, or if the server can't be reached: then the game's own sum
    // maker is used), and how many of each list have been asked
    questionPool: null,
    questionsUsed: {},
    reward: null,   // what the reward screen will show
    status: 'active', // 'active' | 'won' | 'lost'
  };
}

export function runVersion(run) {
  return VERSIONS[run.versionId];
}

export function currentRoom(run) {
  return run.map.nodes[run.currentId];
}

// Which screen opens for a room type.
export function screenForRoom(type) {
  return ROOMS[type]?.screen ?? 'pathMap';
}

// The enemy in the room the player is in (level depends on the floor,
// see pickEnemyId in src/game/enemyAI.js).
export function enemyForRun(run) {
  return ENEMIES[pickEnemyId(run.seed, currentRoom(run), run.map.floors)];
}

export function enterRoom(run, roomId) {
  return { ...run, currentId: roomId };
}

// Mark the room the player is in as done.
export function clearRoom(run) {
  if (run.cleared.includes(run.currentId)) return run;
  return { ...run, cleared: [...run.cleared, run.currentId] };
}

export function heal(run, amount) {
  return { ...run, hearts: Math.min(run.maxHearts, run.hearts + amount) };
}

export function damage(run, amount) {
  const hearts = Math.max(0, run.hearts - amount);
  return { ...run, hearts, status: hearts <= 0 ? 'lost' : run.status };
}

export function addCoins(run, amount) {
  return { ...run, coins: Math.max(0, run.coins + amount) };
}

// Every card the player has this run (deck + stash).
export function collectedSpells(run) {
  return [...run.deck, ...run.stash];
}

// A new card goes into the deck, or into the stash when the deck is full.
export function addSpell(run, spellId) {
  if (collectedSpells(run).includes(spellId)) return run;
  if (run.deck.length < MAX_DECK) return { ...run, deck: [...run.deck, spellId] };
  return { ...run, stash: [...run.stash, spellId] };
}

// Three cards to choose from (cards already collected are left out).
export function makeSpellOffers(run) {
  return spellOffers(collectedSpells(run), currentRoom(run).floor / run.map.floors);
}

// Deck screen: swap a deck card with a stash card.
export function swapSpell(run, deckIndex, stashIndex) {
  const deck = [...run.deck];
  const stash = [...run.stash];
  [deck[deckIndex], stash[stashIndex]] = [stash[stashIndex], deck[deckIndex]];
  return { ...run, deck, stash };
}

// Deck screen: move a card out of the deck (the deck keeps at least 1).
export function moveToStash(run, deckIndex) {
  if (run.deck.length <= 1) return run;
  return {
    ...run,
    deck: run.deck.filter((_, i) => i !== deckIndex),
    stash: [...run.stash, run.deck[deckIndex]],
  };
}

// Deck screen: move a stash card into a free deck slot.
export function moveToDeck(run, stashIndex) {
  if (run.deck.length >= MAX_DECK) return run;
  return {
    ...run,
    deck: [...run.deck, run.stash[stashIndex]],
    stash: run.stash.filter((_, i) => i !== stashIndex),
  };
}

// The deck can't be changed in the middle of a fight.
export function deckLocked(run) {
  const room = currentRoom(run);
  return (room.type === 'combat' || room.type === 'boss') && !run.cleared.includes(run.currentId);
}

export function addItem(run, itemId) {
  return { ...run, items: [...run.items, itemId] };
}

export function drinkPotion(run, index) {
  const potion = run.potions[index];
  if (!potion) return run;
  const potions = run.potions.filter((_, i) => i !== index);
  const next = { ...run, potions };
  return potion === 'heal' ? heal(next, 0.5) : next;
}

export function addPotion(run, potionId) {
  return { ...run, potions: [...run.potions, potionId].slice(0, 4) };
}

// The item stays and keeps its power; only its curse is lifted.
export function removeCurse(run, itemId) {
  return { ...run, cleansed: [...run.cleansed, itemId] };
}

export function isCursed(run, itemId) {
  return Boolean(ITEMS[itemId]?.cursed) && !run.cleansed.includes(itemId);
}

export function cursedItems(run) {
  return run.items.filter((id) => isCursed(run, id)).map((id) => ITEMS[id]);
}

// An AI sum from the pool has been asked (the next one comes from further
// down its list). The game's own sums are made fresh, so they aren't counted.
export function markQuestionUsed(run, question) {
  const key = question?.poolKey;
  const next = { ...run, lastAsked: question?.display ?? null };
  if (!key) return next;
  return { ...next, questionsUsed: { ...run.questionsUsed, [key]: (run.questionsUsed?.[key] ?? 0) + 1 } };
}

// Count answers for the run stats screen (and per topic for Orrin's summary).
// Pass the `question` and what the player `given` so a wrong answer can be
// remembered.
export function recordAnswer(run, { correct, hintsUsed = 0, topic, timeMs = 0, question, given }) {
  const floor = currentRoom(run).floor;
  const stats = { ...run.stats };
  stats.hints += hintsUsed;
  if (correct) {
    stats.solved += 1;
    stats.streak += 1;
    stats.bestStreak = Math.max(stats.bestStreak, stats.streak);
  } else {
    stats.errors += 1;
    stats.streak = 0;
  }
  const floors = [...stats.floors];
  const i = floors.findIndex((f) => f.floor === floor);
  const entry = i >= 0 ? { ...floors[i] } : { floor, correct: 0, total: 0 };
  entry.total += 1;
  if (correct) entry.correct += 1;
  if (i >= 0) floors[i] = entry;
  else floors.push(entry);
  stats.floors = floors;
  const topicStats = { ...run.topicStats };
  if (topic) {
    const t = { attempts: 0, correct: 0, timeMs: 0, hints: 0, ...topicStats[topic] };
    topicStats[topic] = {
      attempts: t.attempts + 1,
      correct: t.correct + (correct ? 1 : 0),
      timeMs: t.timeMs + Math.round(timeMs),
      hints: t.hints + hintsUsed,
    };
  }
  const mistakes =
    !correct && question
      ? [...(run.mistakes ?? []), { topic, level: question.level ?? 1, display: question.display, answer: question.answer, given: String(given ?? '') }].slice(-12)
      : run.mistakes ?? [];
  return { ...run, stats, topicStats, mistakes };
}

// Rewards for finishing a fight, puzzle or the boss (placeholder amounts).
export function makeReward(run, roomType) {
  const version = runVersion(run);
  const boss = roomType === 'boss';
  return {
    roomType,
    floor: currentRoom(run).floor,
    towerCleared: boss,
    xp: boss ? 300 : roomType === 'puzzle' ? 80 : 120,
    coins: version.usesCoins ? (boss ? 50 : 15) : 0,
    potion: version.usesPotions && roomType === 'combat' ? 'heal' : null,
    spellChoice: !boss,
    spellTaken: false,
  };
}

// Give the player the reward and remember it for the reward screen.
export function grantReward(run, roomType) {
  const reward = makeReward(run, roomType);
  let next = { ...clearRoom(run), reward, xp: run.xp + reward.xp };
  next = addCoins(next, reward.coins);
  if (reward.potion) next = addPotion(next, reward.potion);
  if (reward.spellChoice) {
    // Picked now so the cards don't change if the player looks away
    next.offers = makeSpellOffers(next);
    if (!next.offers.length) next.reward = { ...reward, spellChoice: false }; // every card collected
  }
  if (reward.towerCleared) next.status = 'won';
  return next;
}

export function needsReward(roomType) {
  return REWARD_ROOMS.includes(roomType);
}

// How many floors are done (for progress bars).
export function floorsCleared(run) {
  return Math.max(0, ...run.cleared.map((id) => run.map.nodes[id].floor));
}

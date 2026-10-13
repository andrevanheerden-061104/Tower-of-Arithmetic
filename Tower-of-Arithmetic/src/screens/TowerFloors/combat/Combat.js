import { useEffect, useRef, useState } from 'react';
import { View } from 'react-native';
import RunBackground from '../../../components/run/RunBackground';
import RunHud from '../../../components/run/RunHud';
import TutorialTarget from '../../../components/tutorial/TutorialTarget';
import { createEnemyState, hearts, hitEnemy, rollForFirstTurn, spellDamage, takeTurn } from '../../../game/enemyAI';
import { ITEMS } from '../../../game/encounters';
import { attackBonus, blockAttack, canRevive, movesFirst } from '../../../game/items';
import { isCorrect, pickQuestion } from '../../../game/questions';
import { currentRoom, damage, drinkPotion, enemyForRun, heal, markQuestionUsed, recordAnswer, runVersion } from '../../../game/run';
import { baseDamage, getSpell } from '../../../game/spells';
import BattleStage from './components/BattleStage';
import BattleToast from './components/BattleToast';
import CastSheet from './components/CastSheet';
import HealthPanel from './components/HealthPanel';
import SpellHand from './components/SpellHand';
import SupplyColumn from './components/SupplyColumn';
import SupplyDetails from './components/SupplyDetails';
import TurnPrompt from './components/TurnPrompt';
import { floorBackground } from '../../../game/tower';
import styles from './Combat.styles';

const ENEMY_DELAY = 700; // ms before the enemy acts

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// A fight, in rounds:
//   1. Player's turn: pick a spell card and solve its sum.
//      Right answer: the spell hits. Wrong answer: it fizzles.
//   2. Enemy's turn: it acts by its script (src/game/enemyAI.js). The player
//      isn't told what's coming; each action is explained as it happens.
// Who goes first is decided once, at the start, by a hidden die roll:
// 1-3 the enemy, 4-6 the player.
//
// Every battle message stays up for at least 3 seconds, or until the
// player closes it, before the fight moves on (see BattleToast).
//
// The boss room uses this same screen with a different enemy, background
// and a title banner (see ../bossRoom).
export default function Combat({
  navigate,
  run,
  character,
  updateRun,
  onVictory,
  onDefeat,
  onAnswer, // saves each answer to the player's topic totals (App.js)
  onLessonDone, // a Spell School lesson finished from "Show me how"
  settings,
  background, // a key of BACKGROUNDS; fights pick a random corridor per room
  banner = null,
  // The tutorial shows this screen frozen at one moment, e.g.
  // { phase: 'player' } or { phase: 'casting', selected: 0 }. Nothing happens
  // on its own then (no dice roll or enemy turn).
  demo = null,
}) {
  const version = runVersion(run);
  const room = currentRoom(run);
  const enemy = enemyForRun(run);
  const boss = room.type === 'boss';

  const [foe, setFoe] = useState(() => createEnemyState(enemy));
  // { roll, first }: the Hourglass of First Light skips the roll
  const [start] = useState(() => (movesFirst(run) ? { roll: null, first: 'player', hourglass: true } : rollForFirstTurn()));
  const [phase, setPhase] = useState(demo?.phase ?? 'intro'); // intro | player | casting | enemy | over
  const [selected, setSelected] = useState(demo?.selected ?? null); // index in the hand
  const [hintsUsed, setHintsUsed] = useState(0);
  const [toast, setToast] = useState(null); // { id, text, tone }
  const [detail, setDetail] = useState(null); // the potion or item popup that is open
  const closeToast = useRef(null); // resolves the message on screen

  const hand = run.deck; // up to 5 cards
  const spell = selected != null ? getSpell(hand[selected]) : null;
  // The sum being cast: picked when a card is tapped. It is always from the
  // run's maths topic, for the player's grade, at the spell card's level
  // (an AI sum from the run's pool if there is one, otherwise the game's own)
  const [question, setQuestion] = useState(() =>
    demo?.phase === 'casting' ? pickQuestion(run, version, Math.max(1, room.floor), getSpell(run.deck[demo.selected ?? 0])) : null,
  );
  const askedAt = useRef(0); // when the sum appeared, to time the answer
  const healing = spell?.kind === 'heal';
  // Items like the Scroll of Sharpened Spells make every attack spell stronger
  const bonus = attackBonus(run);
  // What the cast sheet shows. Weaknesses are secret, so it shows the
  // normal amount; a weakness only shows up as a "Critical hit!".
  const castAmount = !spell ? 0 : healing ? spell.heal : baseDamage(spell) + bonus;

  // Show a battle message and wait until it's gone (3 s, or closed with X).
  const announce = (text, tone) =>
    new Promise((resolve) => {
      closeToast.current = () => {
        closeToast.current = null;
        setToast(null);
        resolve();
      };
      setToast({ id: Date.now(), text, tone });
    });

  const pickSpell = (index) => {
    if (phase !== 'player') return;
    const next = pickQuestion(run, version, Math.max(1, room.floor), getSpell(hand[index]));
    setQuestion(next);
    updateRun((r) => markQuestionUsed(r, next));
    askedAt.current = Date.now();
    setSelected(index);
    setPhase('casting');
  };

  // The enemy's turn. `foeNow` is passed in because state from this render
  // may already be out of date (the spell just hit it).
  // `heartsNow` is passed in when the player's hearts just changed (heal).
  const enemyTurn = async (foeNow, heartsNow = run.hearts) => {
    setPhase('enemy');
    await wait(ENEMY_DELAY);
    const result = takeTurn(foeNow, enemy.name);
    setFoe(result.state);
    // A ring or the veil blocks part of an attack of its element
    const { amount: hurt, guard } = blockAttack(run, result.action, result.damage);
    let heartsLeft = heartsNow - hurt;
    // The Phoenix Feather Charm saves the player once per run
    const revived = heartsLeft <= 0 && canRevive(run);
    if (revived) heartsLeft = 1;
    if (hurt > 0) updateRun((r) => damage(r, hurt));
    const message = guard
      ? `${enemy.name} uses ${result.action.name}! Your ${ITEMS[guard].name} blocks ½ heart${hurt > 0 ? `: you lose ${hearts(hurt)}.` : ', so it does no harm.'}`
      : result.message;
    await announce(message, hurt > 0 ? 'hurt' : guard ? 'heal' : result.action.kind);
    if (revived) await announce(`Your ${ITEMS.phoenixCharm.name} bursts into flame! You rise again with 1 heart.`, 'heal');

    if (heartsLeft <= 0) {
      setPhase('over');
      onDefeat();
    } else {
      setPhase('player');
    }
  };

  // Called by the cast sheet. Returns 'right' or 'wrong'.
  const submit = (answer) => {
    const right = isCorrect(question, answer);
    const timeMs = askedAt.current ? Date.now() - askedAt.current : 0;
    updateRun((r) => recordAnswer(r, { correct: right, hintsUsed, topic: question.type, timeMs, question, given: answer }));
    onAnswer?.({ topic: question.type, version: version.id, correct: right, timeMs, hints: hintsUsed });
    // Hints are counted per sum: start again for the next one
    setHintsUsed(0);
    if (!right) return 'wrong'; // the sheet shows a hint, then calls fizzled()

    setPhase('enemy');

    // Healing spell: heal the player, then it's the enemy's turn
    if (healing) {
      const after = Math.min(run.maxHearts, run.hearts + spell.heal);
      updateRun((r) => heal(r, spell.heal));
      (async () => {
        await announce(
          after > run.hearts ? `${spell.name} heals you for ${hearts(after - run.hearts)}.` : `${spell.name} glows, but your hearts are already full.`,
          'heal',
        );
        enemyTurn(foe, after);
      })();
      return 'right';
    }

    // Attack spell: double damage if the enemy is weak to its element
    const { amount, crit } = spellDamage(spell, enemy.id, bonus);
    const hit = hitEnemy(foe, amount);
    setFoe(hit);
    (async () => {
      await announce(
        crit
          ? `Critical hit! ${spell.name} hits hard! ${enemy.name} loses ${hearts(amount)}.`
          : `${spell.name} hits! ${enemy.name} loses ${hearts(amount)}.`,
        crit ? 'crit' : 'hit',
      );
      if (hit.hearts <= 0) {
        setPhase('over');
        await announce(`${enemy.name} defeated!`, 'win');
        onVictory();
      } else {
        enemyTurn(hit);
      }
    })();
    return 'right';
  };

  // After a wrong answer the player reads the hint, then the enemy acts.
  const fizzled = () => enemyTurn(foe);

  // Start of the fight: say who moves first, then hand over to that side.
  useEffect(() => {
    if (demo) return;
    (async () => {
      const opening = start.hourglass ? `Your ${ITEMS.hourglass.name} glows: you move first!` : start.first === 'enemy' ? `${enemy.name} moves first!` : 'You move first!';
      await announce(opening, start.first === 'enemy' ? 'boost' : 'hit');
      if (start.first === 'enemy') enemyTurn(foe);
      else setPhase('player');
    })();
    // Runs once when the fight opens; the values it reads are the starting ones.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const playerTurn = phase === 'player' || phase === 'casting';

  // Potions are drunk from their popup, on the player's turn (it doesn't
  // use the turn up)
  const drinkFromPopup = () => {
    if (playerTurn && detail?.kind === 'potion') updateRun((r) => drinkPotion(r, detail.index));
    setDetail(null);
  };
  const openSupply = demo ? () => {} : setDetail;
  const supplies = (
    <>
      {version.usesPotions && <SupplyColumn side="left" title="Potions" kind="potions" run={run} onOpen={openSupply} tutorialId="potions" />}
      {run.items.length > 0 && <SupplyColumn side="right" title="Items" kind="items" run={run} onOpen={openSupply} tutorialId="items" />}
    </>
  );
  const supplyPopup = detail ? <SupplyDetails run={run} detail={detail} canDrink={playerTurn} onDrink={drinkFromPopup} onClose={() => setDetail(null)} /> : null;
  const hud = (
    <View style={styles.top} pointerEvents="box-none">
      <RunHud run={run} navigate={navigate} floor={room.floor} />
      {banner}
    </View>
  );

  return (
    <View style={styles.screen}>
      <RunBackground image={background ?? floorBackground(run)} />
      {supplies}

      <BattleStage character={character} enemy={enemy} boss={boss} defeated={foe.hearts <= 0} />

      {/* Whoever's turn it is gets a glowing aura (gold for the player, purple for the enemy) */}
      <HealthPanel side="left" name={character.name} hearts={run.hearts} max={run.maxHearts} active={playerTurn} aura="gold" tutorialId="playerHealth" />
      <HealthPanel
        side="right"
        name={enemy.name}
        hearts={foe.hearts}
        max={foe.max}
        boss={boss}
        active={phase === 'enemy' && foe.hearts > 0}
        aura="shadow"
        tutorialId="enemyHealth"
      />

      <View style={styles.bottom}>
        <TurnPrompt version={version} deckSize={run.deck.length} waiting={!playerTurn} enemyName={enemy.name} />
        <TutorialTarget id="spellHand">
          <SpellHand
            hand={hand}
            version={version}
            dungeonTypeId={run.dungeonTypeId}
            selected={phase === 'casting' ? selected : null}
            disabled={phase !== 'player'}
            onPick={pickSpell}
          />
        </TutorialTarget>
      </View>

      {hud}

      {toast && <BattleToast key={toast.id} text={toast.text} tone={toast.tone} onClose={() => closeToast.current?.()} />}

      {phase === 'casting' && question && (
        <CastSheet
          key={`${selected}-${foe.turn}`}
          version={version}
          grade={run.grade}
          spell={spell}
          question={question}
          spellDamage={castAmount}
          healing={healing}
          potionSlots={version.usesPotions ? 4 : 0}
          itemCount={run.items.length}
          // The top bar, potions and items are drawn again on top of the
          // sheet's dark backdrop, in the same places, so nothing moves
          hud={hud}
          supplies={supplies}
          onSubmit={submit}
          onFizzled={fizzled}
          onHint={() => setHintsUsed((n) => n + 1)}
          onClose={() => setPhase('player')}
          onLessonDone={onLessonDone}
          speech={settings?.speechToText !== false}
          inline={Boolean(demo)}
          overlay={supplyPopup}
        />
      )}

      {/* The cast sheet draws the popup itself while it's open */}
      {phase !== 'casting' && supplyPopup}
    </View>
  );
}

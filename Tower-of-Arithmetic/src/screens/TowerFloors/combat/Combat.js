import { useEffect, useRef, useState } from 'react';
import { View } from 'react-native';
import RunBackground from '../../../components/run/RunBackground';
import RunHud from '../../../components/run/RunHud';
import { createEnemyState, hearts, hitEnemy, rollForFirstTurn, takeTurn } from '../../../game/enemyAI';
import { getQuestion, isCorrect } from '../../../game/questions';
import { currentRoom, damage, drinkPotion, enemyForRoom, recordAnswer, runVersion } from '../../../game/run';
import { getSpell } from '../../../game/spells';
import BattleStage from './components/BattleStage';
import BattleToast from './components/BattleToast';
import CastSheet from './components/CastSheet';
import HealthPanel from './components/HealthPanel';
import SpellHand from './components/SpellHand';
import SupplyColumn from './components/SupplyColumn';
import TurnPrompt from './components/TurnPrompt';
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
  background = 'corridor',
  banner = null,
}) {
  const version = runVersion(run);
  const room = currentRoom(run);
  const enemy = enemyForRoom(room.type);
  const boss = room.type === 'boss';

  const [foe, setFoe] = useState(() => createEnemyState(enemy));
  const [start] = useState(rollForFirstTurn); // { roll, first }
  const [phase, setPhase] = useState('intro'); // intro | player | casting | enemy | over
  const [selected, setSelected] = useState(null); // index in the hand
  const [hintsUsed, setHintsUsed] = useState(0);
  const [toast, setToast] = useState(null); // { id, text, tone }
  const closeToast = useRef(null); // resolves the message on screen

  const hand = run.deck.slice(0, 3);
  const spell = selected != null ? getSpell(hand[selected]) : null;
  const question = spell ? getQuestion(version, run.dungeonTypeId, Math.max(1, room.floor), spell) : null;
  // The haunted ring makes every attack spell stronger
  const spellDamage = spell ? spell.damage + (run.items.includes('hauntedRing') ? 0.5 : 0) : 0;

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
    setSelected(index);
    setPhase('casting');
  };

  // The enemy's turn. `foeNow` is passed in because state from this render
  // may already be out of date (the spell just hit it).
  const enemyTurn = async (foeNow) => {
    setPhase('enemy');
    await wait(ENEMY_DELAY);
    const result = takeTurn(foeNow, enemy.name);
    setFoe(result.state);
    const heartsLeft = run.hearts - result.damage;
    if (result.damage > 0) updateRun((r) => damage(r, result.damage));
    await announce(result.message, result.damage > 0 ? 'hurt' : result.action.kind);

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
    updateRun((r) => recordAnswer(r, { correct: right, hintsUsed }));
    if (!right) return 'wrong'; // the sheet shows a hint, then calls fizzled()

    setHintsUsed(0);
    const hit = hitEnemy(foe, spellDamage);
    setFoe(hit);
    setPhase('enemy');
    (async () => {
      await announce(`${spell.name} hits! ${enemy.name} loses ${hearts(spellDamage)}.`, 'hit');
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
    (async () => {
      await announce(start.first === 'enemy' ? `${enemy.name} moves first!` : 'You move first!', start.first === 'enemy' ? 'boost' : 'hit');
      if (start.first === 'enemy') enemyTurn(foe);
      else setPhase('player');
    })();
    // Runs once when the fight opens; the values it reads are the starting ones.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onDrink = (index) => {
    if (phase === 'player' || phase === 'casting') updateRun((r) => drinkPotion(r, index));
  };

  const playerTurn = phase === 'player' || phase === 'casting';
  const supplies = (
    <>
      {version.usesPotions && <SupplyColumn side="left" title="Potions" kind="potions" run={run} onUse={onDrink} />}
      {run.items.length > 0 && <SupplyColumn side="right" title="Items" kind="items" run={run} />}
    </>
  );
  const hud = (
    <View style={styles.top} pointerEvents="box-none">
      <RunHud run={run} navigate={navigate} floor={room.floor} />
      {banner}
    </View>
  );

  return (
    <View style={styles.screen}>
      <RunBackground image={background} />
      {supplies}

      <BattleStage character={character} enemy={enemy} boss={boss} defeated={foe.hearts <= 0} />

      {/* Whoever's turn it is gets a glowing aura (gold for the player, purple for the enemy) */}
      <HealthPanel side="left" name={character.name} hearts={run.hearts} max={run.maxHearts} active={playerTurn} aura="gold" />
      <HealthPanel
        side="right"
        name={enemy.name}
        hearts={foe.hearts}
        max={foe.max}
        boss={boss}
        active={phase === 'enemy' && foe.hearts > 0}
        aura="shadow"
      />

      <View style={styles.bottom}>
        <TurnPrompt version={version} deckSize={run.deck.length} waiting={!playerTurn} enemyName={enemy.name} />
        <SpellHand
          hand={hand}
          version={version}
          dungeonTypeId={run.dungeonTypeId}
          selected={phase === 'casting' ? selected : null}
          disabled={phase !== 'player'}
          onPick={pickSpell}
        />
      </View>

      {hud}

      {toast && <BattleToast key={toast.id} text={toast.text} tone={toast.tone} onClose={() => closeToast.current?.()} />}

      {phase === 'casting' && question && (
        <CastSheet
          key={`${selected}-${foe.turn}`}
          version={version}
          spell={spell}
          question={question}
          spellDamage={spellDamage}
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
        />
      )}
    </View>
  );
}

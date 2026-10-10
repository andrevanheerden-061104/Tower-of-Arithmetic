import { useState } from 'react';
import { View } from 'react-native';
import RunBackground from '../../../components/run/RunBackground';
import RunHud from '../../../components/run/RunHud';
import { getQuestion, isCorrect } from '../../../game/questions';
import { currentRoom, damage, enemyForRoom, recordAnswer, runVersion, drinkPotion } from '../../../game/run';
import { getSpell } from '../../../game/spells';
import BattleStage from './components/BattleStage';
import CastSheet from './components/CastSheet';
import HealthPanel from './components/HealthPanel';
import SpellHand from './components/SpellHand';
import SupplyColumn from './components/SupplyColumn';
import TurnPrompt from './components/TurnPrompt';
import VictoryToast from './components/VictoryToast';
import styles from './Combat.styles';

const WRONG_BEFORE_HIT = 3; // the enemy only strikes after this many wrong answers
const VICTORY_PAUSE = 1100; // ms the "defeated!" message shows before the reward

// A fight. Pick a spell card, solve its sum, and the spell hits.
// Placeholder rules for now: one sum per fight, a right answer wins it.
// A wrong answer costs nothing at first (the Archmage gives a hint); after
// three wrong answers the enemy strikes for ½ heart.
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

  const [enemyHearts, setEnemyHearts] = useState(enemy.hearts);
  const [selected, setSelected] = useState(null); // index in the hand
  const [casting, setCasting] = useState(false);
  const [wrongCount, setWrongCount] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [won, setWon] = useState(false);
  const [message, setMessage] = useState(null);

  const hand = run.deck.slice(0, 3);
  const spell = selected != null ? getSpell(hand[selected]) : null;
  const question = spell ? getQuestion(version, run.dungeonTypeId, Math.max(1, room.floor), spell) : null;

  const pickSpell = (index) => {
    setSelected(index);
    setCasting(true);
    setMessage(null);
  };

  // Returns 'right', 'wrong' (no harm done) or 'hit' (the enemy struck back)
  const submit = (answer) => {
    if (isCorrect(question, answer)) {
      updateRun((r) => recordAnswer(r, { correct: true, hintsUsed }));
      setCasting(false);
      setEnemyHearts(0);
      setWon(true);
      setTimeout(onVictory, VICTORY_PAUSE);
      return 'right';
    }

    const wrong = wrongCount + 1;
    setWrongCount(wrong);
    updateRun((r) => recordAnswer(r, { correct: false }));
    if (wrong >= WRONG_BEFORE_HIT) {
      const left = run.hearts - 0.5;
      updateRun((r) => damage(r, 0.5));
      setWrongCount(0);
      setMessage(`The ${enemy.name} strikes! You lose ½ heart.`);
      if (left <= 0) setTimeout(onDefeat, 900);
      return 'hit';
    }
    return 'wrong';
  };

  const onDrink = (index) => updateRun((r) => drinkPotion(r, index));

  return (
    <View style={styles.screen}>
      <RunBackground image={background} />

      <View style={styles.top}>
        <RunHud run={run} navigate={navigate} floor={room.floor} />
        {banner}
      </View>

      {version.usesPotions && (
        <SupplyColumn side="left" title="Potions" kind="potions" run={run} onUse={onDrink} />
      )}
      {run.items.length > 0 && <SupplyColumn side="right" title="Items" kind="items" run={run} />}

      <BattleStage character={character} enemy={enemy} boss={boss} defeated={won} />

      <HealthPanel side="left" name={character.name} hearts={run.hearts} max={run.maxHearts} />
      <HealthPanel side="right" name={enemy.name} hearts={enemyHearts} max={enemy.hearts} boss={boss} />

      <View style={styles.bottom}>
        <TurnPrompt version={version} deckSize={run.deck.length} message={message} />
        <SpellHand
          hand={hand}
          version={version}
          dungeonTypeId={run.dungeonTypeId}
          selected={selected}
          onPick={pickSpell}
        />
      </View>

      {won && <VictoryToast name={enemy.name} />}

      {casting && question && (
        <CastSheet
          key={selected}
          version={version}
          spell={spell}
          question={question}
          enemyName={enemy.name}
          onSubmit={submit}
          onHint={() => setHintsUsed((n) => n + 1)}
          onClose={() => setCasting(false)}
        />
      )}
    </View>
  );
}

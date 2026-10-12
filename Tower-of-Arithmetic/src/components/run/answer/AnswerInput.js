import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import NumberPad from '../NumberPad';
import AnswerModeTabs from '../../../screens/TowerFloors/combat/components/AnswerModeTabs';
import DrawPad from './DrawPad';
import SpeakPad from './SpeakPad';

// The three ways to write an answer, with the Keypad / Speak / Draw tabs:
//   keypad  tap the keys (swipe for more maths keys when there are pages)
//   speak   say it (speech to text); hidden when turned off in Settings
//   draw    write it with a finger (read by Orrin, a vision AI)
// Speaking and drawing give text back through `onUse`, and the tabs go back
// to the keypad so the player can check and fix it.
export default function AnswerInput({ pages, columns, keyHeight = 44, onKey, onUse, speech = true, example }) {
  const [mode, setMode] = useState('keypad');

  // Speak and Draw take the same space as the keypad, so nothing jumps
  const rows = Math.max(...pages.map((keys) => Math.ceil(keys.length / columns)));
  const height = rows * keyHeight + (rows - 1) * 8 + (pages.length > 1 ? 52 : 0);
  const use = (text) => {
    setMode('keypad');
    onUse(text);
  };

  return (
    <View style={styles.wrap}>
      <AnswerModeTabs mode={mode} onChange={setMode} modes={speech ? undefined : ['keypad', 'draw']} />
      {mode === 'keypad' && <NumberPad pages={pages} columns={columns} onKey={onKey} keyHeight={keyHeight} />}
      {mode === 'speak' && <SpeakPad height={height} onUse={use} example={example} />}
      {mode === 'draw' && <DrawPad height={height} onUse={use} />}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 10 },
});

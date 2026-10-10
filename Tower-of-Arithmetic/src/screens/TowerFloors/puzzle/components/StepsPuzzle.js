import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import PrimaryButton from '../../../../components/PrimaryButton';
import NumberPad from '../../../../components/run/NumberPad';
import StepRow from '../../../../components/run/StepRow';
import { normalise } from '../../../../game/questions';
import RectangleDiagram from './RectangleDiagram';

// Intermediate: a word problem with a diagram. Write the working step by
// step ("Next" starts a new step); the last step is checked.
export default function StepsPuzzle({ puzzle, onCheck }) {
  const [steps, setSteps] = useState(['']);
  const last = steps.length - 1;

  const press = (key) => {
    setSteps((s) => {
      const copy = [...s];
      if (key === '⌫') copy[last] = copy[last].slice(0, -1);
      else if (key === 'next') return copy[last] ? [...copy, ''] : copy;
      else copy[last] = copy[last] + (['+', '−', '×', '='].includes(key) ? ` ${key} ` : key);
      return copy;
    });
  };

  const finalLine = steps.filter(Boolean).at(-1) ?? '';
  // "16 + 10 = 26", "= 26" and "26" all count: take what's after the last "="
  const finalValue = normalise(finalLine).split('=').at(-1);

  return (
    <>
      <RectangleDiagram width={puzzle.width} height={puzzle.height} unit={puzzle.unit} />
      <View style={styles.steps}>
        {steps.map((value, i) => (
          <StepRow key={i} number={i + 1} value={value} status={i === last ? 'active' : 'done'} unit={i === last ? puzzle.unit : null} />
        ))}
      </View>
      <NumberPad keys={puzzle.keys} columns={4} onKey={press} />
      <PrimaryButton label="Check answer" disabled={!finalLine} onPress={() => onCheck(finalValue === puzzle.answer)} />
    </>
  );
}

const styles = StyleSheet.create({
  steps: { gap: 8 },
});

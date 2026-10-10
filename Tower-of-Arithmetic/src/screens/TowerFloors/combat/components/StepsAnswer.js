import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Text from '../../../../components/AppText';
import Icon from '../../../../components/Icon';
import PrimaryButton from '../../../../components/PrimaryButton';
import NumberPad from '../../../../components/run/NumberPad';
import StepRow from '../../../../components/run/StepRow';
import AnswerModeTabs from './AnswerModeTabs';
import QuestionBox from './QuestionBox';
import { colors, fonts } from '../../../../theme/theme';

// 5 across; the last row is a single wide "Next step" key
const KEYS = ['7', '8', '9', '÷', '⌫', '4', '5', '6', '×', '(', '1', '2', '3', '−', ')', '0', 'x', '/', '+', '=', 'next'];

// Senior: write the working one step at a time. "Next" starts a new step;
// the last step is checked as the answer. Speak and Draw are placeholders.
export default function StepsAnswer({ question, onSubmit }) {
  const [steps, setSteps] = useState(['']);
  const [mode, setMode] = useState('keypad');
  const last = steps.length - 1;

  const press = (key) => {
    setSteps((s) => {
      const copy = [...s];
      if (key === '⌫') copy[last] = copy[last].slice(0, -1);
      else if (key === 'next') return copy[last] ? [...copy, ''] : copy;
      else copy[last] = copy[last] + (key === '=' ? ' = ' : key);
      return copy;
    });
  };

  const answer = steps.filter(Boolean).at(-1) ?? '';

  return (
    <>
      <QuestionBox question={question} compact />

      <View style={styles.steps}>
        {steps.map((value, i) => (
          <StepRow key={i} number={i + 1} value={value} status={i === last ? 'active' : 'done'} />
        ))}
      </View>

      <AnswerModeTabs mode={mode} onChange={setMode} />

      {mode === 'keypad' ? (
        <NumberPad keys={KEYS} columns={5} onKey={press} />
      ) : (
        <View style={styles.placeholder}>
          <Icon name={mode === 'speak' ? 'mic' : 'pencil'} size={32} color={colors.gold} />
          <Text style={styles.placeholderText}>
            {mode === 'speak'
              ? 'Say your step out loud. (Speech to text is not built yet.)'
              : 'Write your step with your finger. (Handwriting is not built yet.)'}
          </Text>
        </View>
      )}

      <PrimaryButton label="Cast spell" disabled={!answer} onPress={() => onSubmit(answer)} />
    </>
  );
}

const styles = StyleSheet.create({
  steps: { gap: 8 },
  placeholder: {
    height: 160,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingHorizontal: 24,
    borderRadius: 18,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: colors.border,
  },
  placeholderText: { fontFamily: fonts.medium, fontSize: 14, lineHeight: 20, textAlign: 'center', color: colors.mute },
});

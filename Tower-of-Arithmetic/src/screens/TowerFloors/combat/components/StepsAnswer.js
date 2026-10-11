import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { STEP_COLUMNS, STEP_KEYS } from '../../../../game/keypads';
import { useWorkingSteps } from '../../../../hooks/useWorkingSteps';
import Text from '../../../../components/AppText';
import Icon from '../../../../components/Icon';
import PrimaryButton from '../../../../components/PrimaryButton';
import NumberPad from '../../../../components/run/NumberPad';
import StepRow from '../../../../components/run/StepRow';
import AnswerModeTabs from './AnswerModeTabs';
import QuestionBox from './QuestionBox';
import SheetBody from './SheetBody';
import { colors, fonts } from '../../../../theme/theme';

// Senior: write the working one step at a time. The sum and the steps
// scroll (newest step kept in view); the Keypad/Speak/Draw tabs, keypad,
// Next step and Cast spell always stay at the bottom. The last step is
// checked as the answer. Speak and Draw are placeholders. A sum with a
// drawing (geometry) is too tall to stay fixed at the top, so it scrolls
// with the steps instead. As steps are
// added the cast sheet grows taller, up to just under the menu button.
export default function StepsAnswer({ question, onSubmit, onOverflow }) {
  const { steps, last, press, nextStep, answer } = useWorkingSteps();
  const [mode, setMode] = useState('keypad');

  const box = <QuestionBox question={question} compact />;
  const tall = Boolean(question.figure);

  return (
    <SheetBody
      stickToEnd={!tall || steps.length > 1}
      onOverflow={onOverflow}
      header={tall ? null : box}
      scroll={
        <>
          {tall && box}
          <View style={styles.steps}>
            {steps.map((value, i) => (
              <StepRow key={i} number={i + 1} value={value} status={i === last ? 'active' : 'done'} />
            ))}
          </View>
        </>
      }
      footer={
        <>
          <AnswerModeTabs mode={mode} onChange={setMode} />
          {mode === 'keypad' ? (
            <NumberPad keys={STEP_KEYS} columns={STEP_COLUMNS} onKey={press} keyHeight={42} />
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
          <View style={styles.actions}>
            <PrimaryButton label="Next step" variant="secondary" disabled={!steps[last]} onPress={nextStep} style={styles.next} />
            <PrimaryButton label="Cast spell" disabled={!answer} onPress={() => onSubmit(answer)} style={styles.cast} />
          </View>
        </>
      }
    />
  );
}

const styles = StyleSheet.create({
  steps: { gap: 8 },
  placeholder: {
    height: 192,
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
  actions: { flexDirection: 'row', gap: 10 },
  next: { flex: 1, alignSelf: 'auto', height: 52 },
  cast: { flex: 1.3, alignSelf: 'auto', height: 52 },
});

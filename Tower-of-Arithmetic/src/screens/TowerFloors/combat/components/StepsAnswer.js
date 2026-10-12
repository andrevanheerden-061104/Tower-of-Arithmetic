import { StyleSheet, View } from 'react-native';
import { STEP_COLUMNS, STEP_KEYS, STEP_MORE_KEYS } from '../../../../game/keypads';
import { useWorkingSteps } from '../../../../hooks/useWorkingSteps';
import PrimaryButton from '../../../../components/PrimaryButton';
import AnswerInput from '../../../../components/run/answer/AnswerInput';
import StepRow from '../../../../components/run/StepRow';
import QuestionBox from './QuestionBox';
import SheetBody from './SheetBody';

// Senior: write the working one step at a time. The sum and the steps
// scroll (newest step kept in view); the Keypad/Speak/Draw tabs, keypad,
// Next step and Cast spell always stay at the bottom. The last step is
// checked as the answer. Speak and Draw fill in the current step (it can
// then be fixed with the keypad); swipe the keypad for more maths keys. A sum with a
// drawing (geometry) is too tall to stay fixed at the top, so it scrolls
// with the steps instead. As steps are
// added the cast sheet grows taller, up to just under the menu button.
export default function StepsAnswer({ question, onSubmit, onOverflow, speech }) {
  const { steps, last, press, nextStep, write, answer } = useWorkingSteps();

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
          <AnswerInput pages={[STEP_KEYS, STEP_MORE_KEYS]} columns={STEP_COLUMNS} keyHeight={42} onKey={press} onUse={write} speech={speech} />
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
  actions: { flexDirection: 'row', gap: 10 },
  next: { flex: 1, alignSelf: 'auto', height: 52 },
  cast: { flex: 1.3, alignSelf: 'auto', height: 52 },
});

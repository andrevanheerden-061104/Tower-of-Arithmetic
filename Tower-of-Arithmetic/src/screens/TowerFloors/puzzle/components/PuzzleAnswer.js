import { Pressable, StyleSheet, View } from 'react-native';
import Text from '../../../../components/AppText';
import PrimaryButton from '../../../../components/PrimaryButton';
import NumberPad from '../../../../components/run/NumberPad';
import StepRow from '../../../../components/run/StepRow';
import { PUZZLE_COLUMNS, PUZZLE_KEYS, STEP_COLUMNS, STEP_KEYS } from '../../../../game/keypads';
import { useWorkingSteps } from '../../../../hooks/useWorkingSteps';
import { colors, fonts } from '../../../../theme/theme';

// How the player answers the sum on a puzzle door:
//   junior        tap one of three big answers
//   intermediate  write the working step by step ("Next" starts a new step)
//   senior        the same, with the full keypad
// The last step is the answer that gets checked.
export default function PuzzleAnswer({ version, question, onCheck }) {
  const work = useWorkingSteps();

  if (version.answerMode === 'tap') {
    return (
      <View style={styles.answers} accessibilityRole="radiogroup">
        {question.choices.map((choice) => (
          <Pressable
            key={choice}
            onPress={() => onCheck(choice)}
            accessibilityRole="button"
            accessibilityLabel={`Answer ${choice}`}
            style={({ pressed }) => [styles.answer, pressed && styles.pressed]}
          >
            <Text style={styles.answerText}>{choice}</Text>
          </Pressable>
        ))}
      </View>
    );
  }

  const senior = version.answerMode === 'steps';
  return (
    <>
      <View style={styles.steps}>
        {work.steps.map((value, i) => (
          <StepRow key={i} number={i + 1} value={value} status={i === work.last ? 'active' : 'done'} />
        ))}
      </View>
      <NumberPad keys={senior ? STEP_KEYS : PUZZLE_KEYS} columns={senior ? STEP_COLUMNS : PUZZLE_COLUMNS} onKey={work.press} keyHeight={44} />
      <View style={styles.actions}>
        {senior && <PrimaryButton label="Next step" variant="secondary" disabled={!work.steps[work.last]} onPress={work.nextStep} style={styles.next} />}
        <PrimaryButton label="Check answer" disabled={!work.answer} onPress={() => onCheck(work.answer)} style={styles.check} />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  answers: { flexDirection: 'row', gap: 12 },
  answer: {
    flex: 1,
    height: 84,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: colors.gold,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2A1F4A',
  },
  pressed: { opacity: 0.75, transform: [{ scale: 0.97 }] },
  answerText: { fontFamily: fonts.bold, fontSize: 34, color: colors.white },
  steps: { gap: 8 },
  actions: { flexDirection: 'row', gap: 10 },
  next: { flex: 1, alignSelf: 'auto', height: 52 },
  check: { flex: 1.3, alignSelf: 'auto', height: 52 },
});

import { StyleSheet, View } from 'react-native';
import Text from '../../../../components/AppText';
import ArchmageHint from '../../../../components/run/ArchmageHint';
import { colors, fonts } from '../../../../theme/theme';

// Placeholder advice from the Archmage about what to practise next.
const ADVICE = {
  junior: {
    hint: 'Great climbing! When you add, start with the bigger number and count on. Try using your fingers or the dots.',
    focus: 'Counting on',
  },
  intermediate: {
    hint: 'Splitting big numbers into tens and ones helped you most. Keep using “Show me a picture” when a sum feels big.',
    focus: 'Splitting numbers',
  },
  senior: {
    hint: 'Most of your errors came from moving a term across the equals sign without changing its sign. Say the opposite operation out loud before you write the step.',
    focus: 'Inverse operations',
  },
};

export default function AdviceCard({ versionId }) {
  const advice = ADVICE[versionId];
  return (
    <View style={styles.wrap}>
      <ArchmageHint title="Archmage’s advice" hint={advice.hint} />
      <View style={styles.focus}>
        <Text style={styles.focusLabel}>Focus:</Text>
        <View style={styles.pill}>
          <Text style={styles.pillText}>{advice.focus}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 8 },
  focus: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 4 },
  focusLabel: { fontFamily: fonts.medium, fontSize: 13, color: colors.mute },
  pill: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 14, borderWidth: 1.5, borderColor: colors.gold, backgroundColor: colors.indigo },
  pillText: { fontFamily: fonts.semibold, fontSize: 13, color: colors.white },
});

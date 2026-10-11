import { StyleSheet, View } from 'react-native';
import Text from '../../../../components/AppText';
import ArchmageHint from '../../../../components/run/ArchmageHint';
import { colors, fonts } from '../../../../theme/theme';

// Orrin's advice about what to practise next: the AI's summary of the run
// when there is one, otherwise placeholder advice for the version.
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

export default function AdviceCard({ versionId, summary, focus, loading }) {
  const advice = summary ? { hint: summary, focus } : ADVICE[versionId];
  return (
    <View style={styles.wrap}>
      <ArchmageHint title="Orrin’s advice" hint={loading ? 'Orrin is reading over your climb…' : advice.hint} />
      {!loading && advice.focus ? (
        <View style={styles.focus}>
          <Text style={styles.focusLabel}>Focus:</Text>
          <View style={styles.pill}>
            <Text style={styles.pillText}>{advice.focus}</Text>
          </View>
        </View>
      ) : null}
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

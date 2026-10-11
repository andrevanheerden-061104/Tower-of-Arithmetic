import { StyleSheet, View } from 'react-native';
import Text from '../../../../components/AppText';
import ArchmageHint from '../../../../components/run/ArchmageHint';
import { colors, fonts } from '../../../../theme/theme';

// Orrin's advice about what to practise next. `summary` is written from
// the run's real results (by the AI, or by the game itself when the AI
// can't be reached: see useRunSummary). `focus` is the topic that had the
// most wrong answers.
export default function AdviceCard({ summary, focus, loading }) {
  return (
    <View style={styles.wrap}>
      <ArchmageHint title="Orrin’s advice" hint={summary ?? 'Orrin is reading over your climb…'} />
      {loading ? <Text style={styles.loading}>Orrin is still thinking: this may change in a moment.</Text> : null}
      {focus ? (
        <View style={styles.focus}>
          <Text style={styles.focusLabel}>Practise next:</Text>
          <View style={styles.pill}>
            <Text style={styles.pillText}>{focus}</Text>
          </View>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 8 },
  loading: { fontFamily: fonts.medium, fontSize: 12, color: colors.mute, paddingHorizontal: 4 },
  focus: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 4 },
  focusLabel: { fontFamily: fonts.medium, fontSize: 13, color: colors.mute },
  pill: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 14, borderWidth: 1.5, borderColor: colors.gold, backgroundColor: colors.indigo },
  pillText: { fontFamily: fonts.semibold, fontSize: 13, color: colors.white },
});

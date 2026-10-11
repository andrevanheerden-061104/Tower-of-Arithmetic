import { StyleSheet, View } from 'react-native';
import Text from '../../../../components/AppText';
import { colors, fonts } from '../../../../theme/theme';

// Where the wrong answers came from: one row per maths topic answered in
// the run, the topic with the most trouble first. `rows` come from
// topicResults() in src/game/runSummary.js (real counts from the run).
export default function ErrorBreakdown({ rows }) {
  const total = rows.reduce((n, row) => n + row.errors, 0);
  return (
    <View style={styles.card}>
      <Text style={styles.heading}>WHERE THE ERRORS CAME FROM</Text>
      {total === 0 ? (
        <Text style={styles.none}>No wrong answers this run. Well done!</Text>
      ) : (
        rows.map((row) => (
          <View key={row.topic} style={styles.row} accessible accessibilityLabel={`${row.label}: ${row.errors} wrong out of ${row.attempts}`}>
            <View style={styles.name}>
              <Text style={styles.label}>{row.label}</Text>
              <Text style={styles.detail}>
                {row.correct} of {row.attempts} right
              </Text>
            </View>
            <View style={styles.track}>
              <View style={[styles.fill, { width: `${(row.errors / total) * 100}%` }]} />
            </View>
            <Text style={styles.count}>{row.errors}</Text>
          </View>
        ))
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { padding: 16, gap: 10, borderRadius: 20, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.panel },
  heading: { fontFamily: fonts.semibold, fontSize: 12, letterSpacing: 1.2, color: colors.mute },
  none: { fontFamily: fonts.medium, fontSize: 14, color: colors.white },
  row: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  name: { flex: 1.4 },
  label: { fontFamily: fonts.medium, fontSize: 13, color: colors.white },
  detail: { fontFamily: fonts.regular, fontSize: 11, color: colors.mute },
  track: { flex: 1, height: 8, borderRadius: 4, backgroundColor: colors.line, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: 4, backgroundColor: '#E58FA8' },
  count: { width: 22, textAlign: 'right', fontFamily: fonts.bold, fontSize: 14, color: colors.white },
});

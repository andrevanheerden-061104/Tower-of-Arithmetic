import { StyleSheet, View } from 'react-native';
import Text from '../../../../components/AppText';
import { colors, fonts } from '../../../../theme/theme';

// Placeholder: which kinds of mistakes were made. Real error tagging needs
// the answer checker to know *why* an answer was wrong (later).
const PLACEHOLDER = {
  junior: [
    { label: 'Counting on', share: 0.5 },
    { label: 'Taking away', share: 0.3 },
    { label: 'Groups of', share: 0.2 },
  ],
  intermediate: [
    { label: 'Times tables', share: 0.5 },
    { label: 'Place value', share: 0.3 },
    { label: 'Adding the parts', share: 0.2 },
  ],
  senior: [
    { label: 'Changing signs across =', share: 0.5 },
    { label: 'Order of operations', share: 0.35 },
    { label: 'Arithmetic slips', share: 0.15 },
  ],
};

export default function ErrorBreakdown({ errors, versionId }) {
  return (
    <View style={styles.card}>
      <Text style={styles.heading}>WHERE THE ERRORS CAME FROM</Text>
      {PLACEHOLDER[versionId].map((row) => {
        const count = Math.round(errors * row.share);
        return (
          <View key={row.label} style={styles.row} accessible accessibilityLabel={`${row.label}: ${count}`}>
            <Text style={styles.label}>{row.label}</Text>
            <View style={styles.track}>
              <View style={[styles.fill, { width: `${row.share * 100}%` }]} />
            </View>
            <Text style={styles.count}>{count}</Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { padding: 16, gap: 10, borderRadius: 20, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.panel },
  heading: { fontFamily: fonts.semibold, fontSize: 12, letterSpacing: 1.2, color: colors.mute },
  row: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  label: { flex: 1.4, fontFamily: fonts.medium, fontSize: 13, color: colors.white },
  track: { flex: 1, height: 8, borderRadius: 4, backgroundColor: colors.line, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: 4, backgroundColor: '#E58FA8' },
  count: { width: 18, textAlign: 'right', fontFamily: fonts.bold, fontSize: 14, color: colors.white },
});

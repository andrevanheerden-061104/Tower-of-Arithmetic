import { StyleSheet, View } from 'react-native';
import Text from '../AppText';
import { colors, fonts } from '../../theme/theme';

const GREEN = '#8FE3B0';

// Worked steps: "Start", "Step 1", … "Answer" (gold) and "Check" (green).
// A red pill under a step says what was done ("− 3 from both sides").
export default function StepsBlock({ rows }) {
  return (
    <View style={styles.list}>
      {rows.map((row, i) => {
        const answer = row.label === 'Answer';
        const check = row.label === 'Check';
        return (
          <View key={i} style={[styles.row, answer && styles.answer, check && styles.check]} accessible accessibilityLabel={`${row.label}: ${row.text}${row.note ? `. ${row.note}` : ''}`}>
            <Text style={[styles.label, answer && styles.goldText, check && styles.greenText]}>{row.label}</Text>
            <View style={styles.body}>
              <Text style={[styles.text, answer && styles.goldText, answer && styles.big, check && styles.greenText]}>{row.text}</Text>
              {row.note ? (
                <View style={styles.note}>
                  <Text style={styles.noteText}>{row.note}</Text>
                </View>
              ) : null}
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  list: { gap: 10 },
  row: {
    minHeight: 56,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.panel,
  },
  answer: { borderColor: colors.gold, borderWidth: 1.5, backgroundColor: '#2B2814' },
  check: { borderColor: GREEN, borderWidth: 1.5, backgroundColor: '#12261A' },
  label: { width: 58, fontFamily: fonts.medium, fontSize: 12, color: colors.mute },
  body: { flex: 1, gap: 6, alignItems: 'flex-start' },
  text: { fontFamily: fonts.bold, fontSize: 18, color: colors.white },
  big: { fontSize: 22 },
  goldText: { color: colors.gold },
  greenText: { color: GREEN },
  note: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8, borderWidth: 1, borderColor: '#FF9B8F', backgroundColor: 'rgba(255,155,143,0.12)' },
  noteText: { fontFamily: fonts.semibold, fontSize: 11, color: '#FF9B8F' },
});

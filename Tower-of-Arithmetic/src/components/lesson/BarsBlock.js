import { StyleSheet, View } from 'react-native';
import Text from '../AppText';
import { colors, fonts } from '../../theme/theme';

// Fraction bars: a bar cut into equal parts with some of them shaded.
export default function BarsBlock({ rows }) {
  return (
    <View style={styles.wrap}>
      {rows.map((row, r) => (
        <View key={r} style={styles.row} accessible accessibilityLabel={`${row.shaded} of ${row.parts} parts shaded: ${row.label}`}>
          <View style={styles.bar}>
            {Array.from({ length: row.parts }, (_, i) => (
              <View key={i} style={[styles.part, i < row.shaded && styles.shaded, i === row.parts - 1 && styles.last]} />
            ))}
          </View>
          <Text style={styles.label}>{row.label}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 12, padding: 16, borderRadius: 18, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.panel },
  row: { gap: 6 },
  bar: { flexDirection: 'row', height: 30, borderRadius: 8, borderWidth: 1.5, borderColor: colors.gold, overflow: 'hidden' },
  part: { flex: 1, borderRightWidth: 1.5, borderRightColor: colors.gold, backgroundColor: colors.bg },
  last: { borderRightWidth: 0 },
  shaded: { backgroundColor: colors.indigo },
  label: { fontFamily: fonts.bold, fontSize: 15, color: colors.white },
});

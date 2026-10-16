import { StyleSheet, View } from 'react-native';
import Text from '../../AppText';
import { colors, fonts } from '../../../theme/theme';

// Fraction bars: each bar cut into equal parts with some shaded.
export default function FractionBars({ model }) {
  return (
    <View style={styles.wrap}>
      {model.rows.map((row, r) => (
        <View key={r} style={styles.row} accessible accessibilityLabel={`${row.shaded} of ${row.parts} equal parts shaded`}>
          <View style={styles.bar}>
            {Array.from({ length: row.parts }, (_, i) => (
              <View key={i} style={[styles.part, i < row.shaded && styles.shaded, i === row.parts - 1 && styles.last]} />
            ))}
          </View>
          <Text style={styles.label} maxScale={1.1}>{row.label}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { width: '100%', gap: 10 },
  row: { gap: 4 },
  bar: { flexDirection: 'row', height: 30, borderRadius: 8, borderWidth: 1.5, borderColor: colors.gold, overflow: 'hidden' },
  part: { flex: 1, borderRightWidth: 1.5, borderRightColor: colors.gold, backgroundColor: colors.bg },
  last: { borderRightWidth: 0 },
  shaded: { backgroundColor: colors.indigo },
  label: { fontFamily: fonts.bold, fontSize: 15, color: colors.white, textAlign: 'center' },
});

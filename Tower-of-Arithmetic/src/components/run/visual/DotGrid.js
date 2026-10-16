import { StyleSheet, View } from 'react-native';
import { colors } from '../../../theme/theme';

// Rows of dots for a times sum: 4 × 6 is 4 rows of 6.
export default function DotGrid({ model }) {
  const size = model.cols > 8 ? 14 : 18;
  return (
    <View style={styles.wrap} accessible accessibilityLabel={`${model.rows} rows of ${model.cols} dots`}>
      {Array.from({ length: model.rows }, (_, r) => (
        <View key={r} style={styles.row}>
          {Array.from({ length: model.cols }, (_, c) => (
            <View key={c} style={[styles.dot, { width: size, height: size, borderRadius: size / 2 }, c % 5 === 4 && styles.fifth]} />
          ))}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 6, alignItems: 'center' },
  row: { flexDirection: 'row', gap: 6 },
  dot: { backgroundColor: colors.gold },
  fifth: { marginRight: 6 },
});

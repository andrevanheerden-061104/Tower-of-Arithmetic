import { StyleSheet, View } from 'react-native';
import Text from '../../AppText';
import { colors, fonts } from '../../../theme/theme';

const FILLS = [colors.indigo, colors.violet, '#5B3E8C', '#3E2A7A'];

// A bar model: blocks side by side that add up to the total under them.
// The block to find is a dashed gold "?" (Figma 08b: 90° | 35° | ?).
export default function BarModel({ model }) {
  const { parts, total } = model;
  return (
    <View style={styles.wrap} accessible accessibilityLabel={`${parts.map((p) => (p.unknown ? 'unknown' : p.label)).join(' plus ')} makes ${total}`}>
      <View style={styles.bar}>
        {parts.map((part, i) => (
          <View
            key={i}
            style={[
              styles.block,
              { flex: Math.max(part.value, 1) },
              part.unknown ? styles.unknown : { backgroundColor: FILLS[i % FILLS.length] },
            ]}
          >
            <Text style={[styles.label, part.unknown && styles.unknownLabel]} numberOfLines={1} adjustsFontSizeToFit maxScale={1.1}>
              {part.unknown ? '?' : part.label}
            </Text>
          </View>
        ))}
      </View>
      <View style={styles.brace} />
      <Text style={styles.total}>{total}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { width: '100%', alignItems: 'center' },
  bar: { width: '100%', flexDirection: 'row', gap: 4, height: 48 },
  block: { minWidth: 44, borderRadius: 10, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 4 },
  unknown: { borderWidth: 2, borderStyle: 'dashed', borderColor: colors.gold, backgroundColor: 'transparent' },
  label: { fontFamily: fonts.bold, fontSize: 17, color: colors.white },
  unknownLabel: { color: colors.gold, fontSize: 22 },
  brace: { width: '100%', height: 10, marginTop: 6, borderWidth: 2, borderTopWidth: 0, borderColor: colors.gold, borderBottomLeftRadius: 6, borderBottomRightRadius: 6 },
  total: { marginTop: 4, fontFamily: fonts.bold, fontSize: 18, color: colors.gold },
});

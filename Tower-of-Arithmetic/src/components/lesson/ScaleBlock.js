import { StyleSheet, View } from 'react-native';
import Text from '../AppText';
import { colors, fonts } from '../../theme/theme';

// A balance scale with one side of an equation on each pan.
export default function ScaleBlock({ left, right }) {
  return (
    <View style={styles.wrap} accessible accessibilityLabel={`A balance scale: ${left} on one side, ${right} on the other. They weigh the same.`}>
      <View style={styles.pivot}>
        <Text style={styles.equals}>=</Text>
      </View>
      <View style={styles.beam} />
      <View style={styles.pans}>
        {[left, right].map((side) => (
          <View key={side} style={styles.side}>
            <View style={styles.string} />
            <View style={styles.pan}>
              <Text style={styles.panText}>{side}</Text>
            </View>
          </View>
        ))}
      </View>
      <View style={styles.post} />
      <View style={styles.base} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', paddingVertical: 8 },
  pivot: { width: 30, height: 30, borderRadius: 15, borderWidth: 2, borderColor: colors.gold, backgroundColor: colors.indigo, alignItems: 'center', justifyContent: 'center', zIndex: 2 },
  equals: { fontFamily: fonts.bold, fontSize: 16, color: colors.gold },
  beam: { width: '86%', height: 4, borderRadius: 2, backgroundColor: colors.gold, marginTop: -2 },
  pans: { width: '86%', flexDirection: 'row', justifyContent: 'space-between' },
  side: { alignItems: 'center', width: 116 },
  string: { width: 2, height: 22, backgroundColor: colors.border },
  pan: { minWidth: 116, paddingVertical: 12, paddingHorizontal: 10, borderBottomLeftRadius: 40, borderBottomRightRadius: 40, borderWidth: 2, borderColor: colors.gold, backgroundColor: '#2A1F4A', alignItems: 'center' },
  panText: { fontFamily: fonts.bold, fontSize: 18, color: colors.white },
  post: { width: 4, height: 50, backgroundColor: colors.border, marginTop: -40, zIndex: -1 },
  base: { width: 90, height: 6, borderRadius: 3, backgroundColor: colors.border },
});

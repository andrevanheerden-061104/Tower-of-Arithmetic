import { StyleSheet, View } from 'react-native';
import Text from '../AppText';
import { colors, fonts } from '../../theme/theme';

// A picture of an equation with orbs: a mystery box (x) plus some orbs on
// one side, "weighs the same as", and orbs on the other side.
export default function OrbsBlock({ left, right, caption }) {
  return (
    <View style={styles.wrap}>
      <View style={styles.panel} accessible accessibilityLabel={`A mystery box and ${left.count} orbs weigh the same as ${right} orbs`}>
        <View style={styles.row}>
          {left.box ? (
            <View style={styles.box}>
              <Text style={styles.boxText}>?</Text>
            </View>
          ) : null}
          {left.box ? <Text style={styles.plus}>+</Text> : null}
          {Array.from({ length: left.count }, (_, i) => (
            <View key={i} style={styles.orb} />
          ))}
        </View>
        <Text style={styles.same}>weighs the same as</Text>
        <View style={styles.row}>
          {Array.from({ length: right }, (_, i) => (
            <View key={i} style={styles.orb} />
          ))}
        </View>
      </View>
      {caption ? <Text style={styles.caption}>{caption}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 10 },
  panel: { alignItems: 'center', gap: 12, padding: 18, borderRadius: 18, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.panel },
  row: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center', gap: 6 },
  box: { width: 44, height: 44, borderRadius: 8, borderWidth: 2, borderColor: colors.gold, backgroundColor: colors.indigo, alignItems: 'center', justifyContent: 'center' },
  boxText: { fontFamily: fonts.bold, fontSize: 22, color: colors.white },
  plus: { fontFamily: fonts.bold, fontSize: 20, color: colors.white, marginHorizontal: 4 },
  orb: { width: 26, height: 26, borderRadius: 13, backgroundColor: '#F7EF8A', borderWidth: 2, borderColor: '#C9B84A' },
  same: { fontFamily: fonts.medium, fontSize: 13, color: colors.mute },
  caption: { fontFamily: fonts.semibold, fontSize: 13, color: colors.white, textAlign: 'center' },
});

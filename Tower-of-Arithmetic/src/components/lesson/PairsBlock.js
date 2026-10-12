import { StyleSheet, View } from 'react-native';
import Text from '../AppText';
import { colors, fonts } from '../../theme/theme';

// Small cards side by side: a symbol or sum on top, what it means below
// ("+ ⇄ −" / "add undoes take away"). Wraps onto more rows when needed.
export default function PairsBlock({ items }) {
  return (
    <View style={styles.grid}>
      {items.map(([top, bottom], i) => (
        <View key={i} style={[styles.card, items.length > 2 && styles.small]} accessible accessibilityLabel={`${top}: ${bottom}`}>
          <Text style={styles.top}>{top}</Text>
          <Text style={styles.bottom}>{bottom}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  card: {
    flexGrow: 1,
    flexBasis: '45%',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.violet,
    backgroundColor: '#2A1F4A',
  },
  small: { flexBasis: '40%' },
  top: { fontFamily: fonts.bold, fontSize: 18, color: colors.gold, textAlign: 'center' },
  bottom: { fontFamily: fonts.medium, fontSize: 12, color: colors.mute, textAlign: 'center' },
});

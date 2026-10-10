import { Pressable, StyleSheet, View } from 'react-native';
import Text from '../../../../components/AppText';
import Icon from '../../../../components/Icon';
import { colors, fonts } from '../../../../theme/theme';

// One maths type to focus on (e.g. "x  Algebra").
export default function TypeTile({ type, selected, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="radio"
      accessibilityState={{ checked: selected }}
      accessibilityLabel={type.label}
      style={({ pressed }) => [styles.tile, selected && styles.selected, pressed && styles.pressed]}
    >
      <View style={styles.symbol}>
        <Text style={styles.symbolText}>{type.symbol}</Text>
      </View>
      <Text style={styles.label} numberOfLines={1}>
        {type.label}
      </Text>
      {selected && <Icon name="check" size={18} color={colors.gold} strokeWidth={2.5} />}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tile: {
    flex: 1,
    height: 64,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.panel,
  },
  selected: { borderWidth: 2, borderColor: colors.gold, backgroundColor: '#2A1F5C' },
  pressed: { opacity: 0.85 },
  symbol: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.indigo,
  },
  symbolText: { fontFamily: fonts.bold, fontSize: 16, color: colors.white },
  label: { flex: 1, fontFamily: fonts.semibold, fontSize: 15, color: colors.white },
});

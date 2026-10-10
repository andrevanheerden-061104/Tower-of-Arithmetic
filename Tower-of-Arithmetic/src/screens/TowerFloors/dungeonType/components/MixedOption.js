import { Pressable, StyleSheet, View } from 'react-native';
import Text from '../../../../components/AppText';
import Icon from '../../../../components/Icon';
import { colors, fonts } from '../../../../theme/theme';

// "Mixed dungeon": every maths type, shuffled floor by floor.
export default function MixedOption({ selected, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="radio"
      accessibilityState={{ checked: selected }}
      accessibilityLabel="Mixed dungeon. Every maths type, shuffled each floor"
      style={({ pressed }) => [styles.card, selected && styles.selected, pressed && styles.pressed]}
    >
      <View style={styles.badge}>
        <Text style={styles.badgeText}>+ × %</Text>
      </View>
      <View style={styles.text}>
        <Text style={styles.title}>Mixed dungeon</Text>
        <Text style={styles.detail}>Every maths type, shuffled each floor</Text>
      </View>
      <View style={[styles.radio, selected && styles.radioOn]}>
        {selected && <Icon name="check" size={14} color={colors.bg} strokeWidth={3} />}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    minHeight: 84,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.panel,
  },
  selected: { borderWidth: 2, borderColor: colors.gold, backgroundColor: '#2A1F5C' },
  pressed: { opacity: 0.85 },
  badge: {
    width: 52,
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.violet,
  },
  badgeText: { fontFamily: fonts.bold, fontSize: 13, color: colors.white },
  text: { flex: 1, gap: 3 },
  title: { fontFamily: fonts.bold, fontSize: 18, color: colors.white },
  detail: { fontFamily: fonts.regular, fontSize: 13, color: colors.mute },
  radio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioOn: { backgroundColor: colors.gold, borderColor: colors.gold },
});

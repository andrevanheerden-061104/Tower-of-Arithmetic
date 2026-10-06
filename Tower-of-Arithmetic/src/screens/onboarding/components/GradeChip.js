import { Pressable, StyleSheet, Text } from 'react-native';
import Icon from '../../../components/Icon';
import { colors, fonts } from '../../../theme/theme';

// A single grade button. The selected one gets a tick as well as a colour
// change, so the choice is clear without relying on colour alone.
export default function GradeChip({ grade, selected, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      accessibilityLabel={`Grade ${grade}`}
      style={({ pressed }) => [styles.chip, selected && styles.chipSelected, pressed && styles.pressed]}
    >
      {selected && <Icon name="check" size={16} color={colors.gold} strokeWidth={2.5} />}
      <Text style={styles.label}>Grade {grade}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    flex: 1,
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.panel,
  },
  chipSelected: {
    backgroundColor: colors.indigo,
    borderColor: colors.gold,
    borderWidth: 1.5,
  },
  pressed: { opacity: 0.8 },
  label: { fontFamily: fonts.semibold, fontSize: 15, color: colors.white },
});

import { Pressable, StyleSheet } from 'react-native';
import Text from '../../../components/AppText';
import Icon from '../../../components/Icon';
import { colors, fonts } from '../../../theme/theme';

// One of the Small / Medium / Large buttons. The chosen one gets a tick.
export default function TextSizeOption({ label, sampleSize, selected, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="radio"
      accessibilityState={{ checked: selected }}
      accessibilityLabel={`${label} text`}
      style={({ pressed }) => [styles.option, selected && styles.selected, pressed && styles.pressed]}
    >
      <Text style={[styles.sample, { fontSize: sampleSize }, selected && styles.selectedText]}>
        Aa
      </Text>
      <Text style={[styles.label, selected && styles.selectedText]}>{label}</Text>
      {selected ? <Icon name="check" size={14} color={colors.bg} strokeWidth={3} /> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  option: {
    flex: 1,
    height: 76,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.border,
    backgroundColor: colors.bg,
  },
  selected: { backgroundColor: colors.gold, borderColor: colors.gold },
  pressed: { opacity: 0.8 },
  sample: { fontFamily: fonts.bold, color: colors.white },
  label: { fontFamily: fonts.semibold, fontSize: 12, color: colors.white },
  selectedText: { color: colors.bg },
});

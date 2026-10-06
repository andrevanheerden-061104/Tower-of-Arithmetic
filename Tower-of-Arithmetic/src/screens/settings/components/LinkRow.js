import { Pressable, StyleSheet } from 'react-native';
import Text from '../../../components/AppText';
import Icon from '../../../components/Icon';
import { colors, fonts } from '../../../theme/theme';

// A row that takes you somewhere, with an optional current value on the right.
export default function LinkRow({ label, value, icon, onPress, accessibilityHint, last }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={value ? `${label}, ${value}` : label}
      accessibilityHint={accessibilityHint}
      style={({ pressed }) => [styles.row, !last && styles.divider, pressed && styles.pressed]}
    >
      <Text style={styles.label}>{label}</Text>
      {value ? <Text style={styles.value}>{value}</Text> : null}
      <Icon name={icon} size={20} color={colors.white} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { minHeight: 56, flexDirection: 'row', alignItems: 'center', gap: 10 },
  divider: { borderBottomWidth: 1, borderBottomColor: colors.line },
  pressed: { opacity: 0.8 },
  label: { flex: 1, fontFamily: fonts.semibold, fontSize: 15, color: colors.white },
  value: { fontFamily: fonts.medium, fontSize: 14, color: colors.gold },
});

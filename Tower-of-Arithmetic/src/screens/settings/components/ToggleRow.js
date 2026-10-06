import { Pressable, StyleSheet, Text, View } from 'react-native';
import Toggle from './Toggle';
import { colors, fonts } from '../../../theme/theme';

// One setting that can be switched on or off. Tap anywhere on the row.
export default function ToggleRow({ label, hint, value, onChange, last }) {
  return (
    <Pressable
      onPress={() => onChange(!value)}
      accessibilityRole="switch"
      accessibilityState={{ checked: value }}
      accessibilityLabel={label}
      accessibilityHint={hint}
      style={({ pressed }) => [styles.row, !last && styles.divider, pressed && styles.pressed]}
    >
      <View style={styles.text}>
        <Text style={styles.label}>{label}</Text>
        {hint ? <Text style={styles.hint}>{hint}</Text> : null}
      </View>
      <Toggle value={value} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    minHeight: 60,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  divider: { borderBottomWidth: 1, borderBottomColor: colors.line },
  pressed: { opacity: 0.8 },
  text: { flex: 1, gap: 2 },
  label: { fontFamily: fonts.semibold, fontSize: 15, color: colors.white },
  hint: { fontFamily: fonts.regular, fontSize: 12, lineHeight: 17, color: colors.mute },
});

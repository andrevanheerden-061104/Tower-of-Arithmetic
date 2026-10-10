import { Pressable, StyleSheet } from 'react-native';
import Text from '../../../../components/AppText';
import { colors, fonts } from '../../../../theme/theme';

// A reason the player can drop into the selected proof line.
export default function ReasonChip({ label, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Reason: ${label}`}
      style={({ pressed }) => [styles.chip, pressed && styles.pressed]}
    >
      <Text style={styles.text}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    minHeight: 44,
    justifyContent: 'center',
    paddingHorizontal: 14,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: '#2A2340',
  },
  pressed: { opacity: 0.75 },
  text: { fontFamily: fonts.semibold, fontSize: 13, color: colors.white },
});

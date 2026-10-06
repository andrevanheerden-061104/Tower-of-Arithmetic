import { Pressable, StyleSheet, View } from 'react-native';
import Text from './AppText';
import { colors, fonts } from '../theme/theme';

// The main game button: dark fill, gold border and three corner dots.
// variant="secondary" is the quieter version (no glow, no dots).
export default function PrimaryButton({ label, onPress, variant = 'primary', disabled = false, style }) {
  const primary = variant === 'primary';

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled }}
      style={({ pressed }) => [
        styles.base,
        primary ? styles.primary : styles.secondary,
        pressed && styles.pressed,
        disabled && styles.disabled,
        style,
      ]}
    >
      <Text style={[styles.label, !primary && styles.labelSecondary]}>{label}</Text>

      {primary && (
        <View style={styles.dots} pointerEvents="none">
          <View style={[styles.dot, { left: 0, top: 0 }]} />
          <View style={[styles.dot, { left: 9, top: 0 }]} />
          <View style={[styles.dot, { left: 9, top: 12 }]} />
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    alignSelf: 'stretch',
    height: 60,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primary: {
    backgroundColor: colors.bg,
    borderWidth: 1.5,
    borderColor: colors.gold,
    // Soft gold glow (iOS shadow / Android elevation)
    shadowColor: colors.gold,
    shadowOpacity: 0.35,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 0 },
    elevation: 6,
  },
  secondary: {
    backgroundColor: colors.panel,
    borderWidth: 1,
    borderColor: colors.border,
  },
  pressed: { opacity: 0.8, transform: [{ scale: 0.98 }] },
  disabled: { opacity: 0.45 },
  label: {
    fontFamily: fonts.bold,
    fontSize: 20,
    color: colors.white,
  },
  labelSecondary: {
    fontFamily: fonts.semibold,
    fontSize: 16,
  },
  dots: {
    position: 'absolute',
    right: 15,
    top: 12,
    width: 13,
    height: 16,
  },
  dot: {
    position: 'absolute',
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(193,191,174,0.45)',
  },
});

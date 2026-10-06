import { Pressable, StyleSheet, View } from 'react-native';
import Text from '../../../components/AppText';
import Icon from '../../../components/Icon';
import { colors, fonts } from '../../../theme/theme';

// One chunky button in the bottom row of the home screen.
export default function NavTile({ label, icon, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={({ pressed }) => [styles.tile, pressed && styles.pressed]}
    >
      <Icon name={icon} size={28} color={colors.gold} strokeWidth={1.8} />
      <Text style={styles.label} maxScale={1.08}>
        {label}
      </Text>

      {/* Three corner dots, matching the main button */}
      <View style={styles.dots} pointerEvents="none">
        <View style={[styles.dot, { left: 0, top: 0 }]} />
        <View style={[styles.dot, { left: 9, top: 0 }]} />
        <View style={[styles.dot, { left: 9, top: 12 }]} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tile: {
    flex: 1,
    height: 84,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.panel,
  },
  pressed: { opacity: 0.8, transform: [{ scale: 0.98 }] },
  label: {
    fontFamily: fonts.bold,
    fontSize: 12,
    letterSpacing: 0.3,
    textTransform: 'uppercase',
    color: colors.white,
  },
  dots: { position: 'absolute', right: 9, top: 9, width: 13, height: 16 },
  dot: {
    position: 'absolute',
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(193,191,174,0.45)',
  },
});

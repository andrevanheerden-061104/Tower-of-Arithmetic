import { Pressable, StyleSheet, View } from 'react-native';
import Text from '../AppText';
import Icon from '../Icon';
import { colors, fonts } from '../../theme/theme';

// "Play as a guest": skip the account and go straight in. Nothing is
// saved for a guest (no XP, levels, badges or progress), so it's for
// trying the game out, e.g. a lecturer testing it.
export default function GuestButton({ onPress }) {
  return (
    <View style={styles.wrap}>
      <View style={styles.divider}>
        <View style={styles.line} />
        <Text style={styles.or}>or</Text>
        <View style={styles.line} />
      </View>
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel="Play as a guest. Your progress and XP won't be saved."
        style={({ pressed }) => [styles.button, pressed && styles.pressed]}
      >
        <Icon name="user" size={18} color={colors.gold} />
        <Text style={styles.label}>Play as a guest</Text>
      </Pressable>
      <Text style={styles.note}>No account needed. Your progress and XP won’t be saved.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 10, marginTop: 6 },
  divider: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  line: { flex: 1, height: 1, backgroundColor: colors.line },
  or: { fontFamily: fonts.medium, fontSize: 12, color: colors.mute },
  button: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: 'rgba(23,20,31,0.85)',
  },
  pressed: { opacity: 0.8 },
  label: { fontFamily: fonts.semibold, fontSize: 16, color: colors.white },
  note: { fontFamily: fonts.regular, fontSize: 12, lineHeight: 17, color: colors.mute, textAlign: 'center' },
});

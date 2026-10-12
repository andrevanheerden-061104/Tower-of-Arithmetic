import { Pressable, StyleSheet } from 'react-native';
import Text from '../AppText';
import Icon from '../Icon';
import { colors, fonts } from '../../theme/theme';

// "Show me how": opens Orrin's lesson on this sum's topic after a wrong answer.
export default function LessonLink({ onPress, junior }) {
  const label = junior ? 'Show me how' : 'Show me how · Spell School lesson';
  return (
    <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel={label} style={({ pressed }) => [styles.link, pressed && styles.pressed]}>
      <Icon name="sparkles" size={18} color={colors.gold} />
      <Text style={styles.text}>{label}</Text>
      <Icon name="chevronRight" size={16} color={colors.gold} strokeWidth={2.5} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  link: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.gold,
    backgroundColor: colors.panel,
  },
  pressed: { opacity: 0.8 },
  text: { flex: 1, fontFamily: fonts.semibold, fontSize: 15, color: colors.gold },
});

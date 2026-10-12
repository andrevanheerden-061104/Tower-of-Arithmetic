import { Image, Pressable, StyleSheet, View } from 'react-native';
import Text from '../../../../components/AppText';
import Icon from '../../../../components/Icon';
import { GUIDE } from '../../../../data/guide';
import { colors, fonts } from '../../../../theme/theme';

// "Spell School": shown when one maths type is picked. Opens Orrin's short
// lesson on it before the run. A tick shows once it has been finished.
export default function LessonCard({ type, junior, done, onPress }) {
  const title = junior ? `Learn ${type.label.toLowerCase()} with Orrin` : `Learn ${type.label.toLowerCase()} first`;
  const detail = done ? 'Lesson done. Open it again any time.' : junior ? 'A short lesson. Then try one!' : 'A short lesson with worked examples and one to try.';
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Spell School. ${title}. ${detail}`}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <View style={styles.avatar}>
        <Image source={GUIDE.face} style={styles.face} />
      </View>
      <View style={styles.text}>
        <Text style={styles.label}>SPELL SCHOOL</Text>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.detail}>{detail}</Text>
      </View>
      {done ? (
        <View style={styles.done}>
          <Icon name="check" size={14} color={colors.bg} strokeWidth={3} />
        </View>
      ) : (
        <Icon name="chevronRight" size={20} color={colors.gold} strokeWidth={2.5} />
      )}
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
    borderWidth: 1.5,
    borderColor: colors.gold,
    backgroundColor: colors.panel,
    boxShadow: '0px 0px 16px rgba(242,234,121,0.18)',
  },
  pressed: { opacity: 0.85 },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 1.5,
    borderColor: colors.gold,
    overflow: 'hidden',
    backgroundColor: colors.indigo,
  },
  face: { width: '100%', height: '100%' },
  text: { flex: 1, gap: 2 },
  label: { fontFamily: fonts.semibold, fontSize: 11, letterSpacing: 1.2, color: colors.gold },
  title: { fontFamily: fonts.bold, fontSize: 16, color: colors.white },
  detail: { fontFamily: fonts.regular, fontSize: 13, lineHeight: 18, color: colors.mute },
  done: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.gold,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

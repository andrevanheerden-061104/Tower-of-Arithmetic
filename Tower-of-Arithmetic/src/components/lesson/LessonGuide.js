import { Image, Pressable, StyleSheet, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import Text from '../AppText';
import Icon from '../Icon';
import { GUIDE } from '../../data/guide';
import { colors, fonts } from '../../theme/theme';

// Orrin teaching: his picture leaning over a speech bubble with what he
// says and a button to go on ("Let's begin", "Next", "Practise in the tower").
// `secondary` adds a quieter full-width button under the bubble.
export default function LessonGuide({ text, action, onAction, secondary, onSecondary, junior }) {
  return (
    <View style={styles.wrap}>
      <View style={styles.guide} pointerEvents="none">
        <Image source={GUIDE.image} style={styles.guideImage} resizeMode="contain" accessibilityLabel={`${GUIDE.name}, your teacher`} />
        <Svg width={30} height={22} style={styles.tail}>
          <Path d="M0 22 L15 1 L30 22 Z" fill={colors.panel} />
          <Path d="M0.8 21.5 L15 1.5 L29.2 21.5" fill="none" stroke={colors.gold} strokeWidth={1.5} strokeLinejoin="round" />
        </Svg>
      </View>
      <View style={styles.bubble}>
        <View style={styles.header}>
          <Text style={styles.name}>{GUIDE.name}</Text>
          <Text style={styles.school}>Spell School</Text>
        </View>
        <Text style={[styles.message, junior && styles.messageJunior]} accessibilityLiveRegion="polite">
          {text}
        </Text>
        {action ? (
          <View style={styles.actions}>
            <Pressable
              onPress={onAction}
              accessibilityRole="button"
              accessibilityLabel={action}
              style={({ pressed }) => [styles.next, pressed && styles.pressed]}
            >
              <Text style={[styles.nextText, junior && styles.nextJunior]}>{action}</Text>
              <Icon name="chevronRight" size={18} color={colors.gold} strokeWidth={2.5} />
            </Pressable>
          </View>
        ) : null}
      </View>
      {secondary ? (
        <Pressable onPress={onSecondary} accessibilityRole="button" style={({ pressed }) => [styles.secondary, pressed && styles.pressed]}>
          <Text style={styles.secondaryText}>{secondary}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 12 },
  // The top of Orrin (hat to chest), cut off by the bubble, as in the tutorial
  guide: { height: 132, overflow: 'hidden', zIndex: 2, marginBottom: -12 },
  guideImage: { position: 'absolute', width: 145, height: 228, left: 0, top: 18 },
  tail: { position: 'absolute', left: 118, bottom: 0 },
  bubble: {
    marginTop: -2,
    gap: 12,
    paddingTop: 18,
    paddingBottom: 16,
    paddingHorizontal: 20,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: colors.gold,
    backgroundColor: colors.panel,
    boxShadow: '0px 0px 22px rgba(242,234,121,0.28)',
  },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  name: { fontFamily: fonts.bold, fontSize: 15, letterSpacing: 2, textTransform: 'uppercase', color: colors.gold },
  school: { fontFamily: fonts.semibold, fontSize: 12, color: colors.mute },
  message: { fontFamily: fonts.medium, fontSize: 16, lineHeight: 24, color: colors.white },
  messageJunior: { fontFamily: fonts.semibold, fontSize: 19, lineHeight: 28 },
  actions: { flexDirection: 'row', justifyContent: 'flex-end' },
  next: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 22,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: colors.gold,
    backgroundColor: colors.bg,
    boxShadow: '0px 0px 12px rgba(242,234,121,0.35)',
  },
  pressed: { opacity: 0.8, transform: [{ scale: 0.98 }] },
  nextText: { fontFamily: fonts.bold, fontSize: 16, color: colors.white },
  nextJunior: { fontSize: 18 },
  secondary: {
    minHeight: 52,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.panel,
  },
  secondaryText: { fontFamily: fonts.semibold, fontSize: 15, color: colors.white },
});

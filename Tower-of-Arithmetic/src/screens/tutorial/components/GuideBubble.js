import { Image, Pressable, StyleSheet, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import Text from '../../../components/AppText';
import Icon from '../../../components/Icon';
import { GUIDE } from '../../../data/guide';
import { colors, fonts } from '../../../theme/theme';

// Orrin leaning over his speech bubble: the step count, what he says (the
// word he's saying lights up), a button to hear it again, "Skip tutorial"
// and "Next" (on the last step: no skip, and a "Let's climb!" button).
export default function GuideBubble({
  text,
  index,
  total,
  junior,
  spokenWord = -1,
  speaking = false,
  canReplay = false,
  onReplay,
  onNext,
  onSkip,
  onLayout,
  style,
}) {
  const last = index === total - 1;
  const words = text.split(' ');
  return (
    <View style={[styles.wrap, style]} onLayout={onLayout} accessibilityViewIsModal>
      <View style={styles.guide} pointerEvents="none">
        <Image source={GUIDE.image} style={[styles.guideImage, junior && styles.guideImageJunior]} resizeMode="contain" accessibilityLabel={`${GUIDE.name}, your guide`} />
        <Svg width={30} height={22} style={styles.tail}>
          <Path d="M0 22 L15 1 L30 22 Z" fill={colors.panel} />
          <Path d="M0.8 21.5 L15 1.5 L29.2 21.5" fill="none" stroke={colors.gold} strokeWidth={1.5} strokeLinejoin="round" />
        </Svg>
      </View>

      <View style={styles.bubble}>
        <View style={styles.header}>
          <Text style={[styles.name, junior && styles.nameJunior]}>{GUIDE.name}</Text>
          <Text style={[styles.step, junior && styles.stepJunior]}>
            {junior ? `${index + 1} / ${total}` : `Step ${index + 1} of ${total}`}
          </Text>
        </View>

        <Text style={[styles.message, junior && styles.messageJunior]} accessibilityLabel={text}>
          {words.map((word, i) => (
            <Text key={i}>
              <Text style={i === spokenWord && styles.spoken}>{word}</Text>
              {i < words.length - 1 ? ' ' : ''}
            </Text>
          ))}
        </Text>

        <View style={styles.actions}>
          {last ? (
            <View />
          ) : (
            <Pressable onPress={onSkip} accessibilityRole="button" style={styles.skip}>
              <Text style={[styles.skipText, junior && styles.skipJunior]}>{junior ? 'Skip' : 'Skip tutorial'}</Text>
            </Pressable>
          )}
          <View style={styles.buttons}>
            {canReplay && (
              <Pressable
                onPress={onReplay}
                accessibilityRole="button"
                accessibilityLabel={speaking ? `${GUIDE.name} is speaking. Tap to start again` : `Hear ${GUIDE.name} again`}
                style={({ pressed }) => [styles.replay, speaking && styles.replayOn, pressed && styles.pressed]}
              >
                <Icon name="volume" size={22} color={speaking ? colors.bg : colors.gold} />
              </Pressable>
            )}
            <Pressable
              onPress={onNext}
              accessibilityRole="button"
              style={({ pressed }) => [styles.next, pressed && styles.pressed]}
            >
              <Text style={[styles.nextText, junior && styles.nextJunior]}>
                {last ? (junior ? "Let's go!" : "Let's climb!") : 'Next'}
              </Text>
              <Icon name="chevronRight" size={18} color={colors.gold} strokeWidth={2.5} />
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { position: 'absolute' },
  // The top of Orrin (hat to chest), cut off by the bubble. Sizes match
  // the Tutorial / Guide component in Figma.
  guide: { height: 132, overflow: 'hidden', zIndex: 2 },
  guideImage: { position: 'absolute', width: 145, height: 228, left: 0, top: 18 },
  guideImageJunior: { left: 2, top: 7 },
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
  nameJunior: { fontSize: 17 },
  step: { fontFamily: fonts.semibold, fontSize: 12, color: colors.mute },
  stepJunior: { fontSize: 14 },
  message: { fontFamily: fonts.medium, fontSize: 16, lineHeight: 24, color: colors.white },
  messageJunior: { fontFamily: fonts.semibold, fontSize: 19, lineHeight: 28 },
  // The word being spoken: dark text on gold, so it stands out clearly
  spoken: { color: colors.bg, backgroundColor: colors.gold },
  actions: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  buttons: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  replay: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: colors.gold,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.bg,
  },
  replayOn: { backgroundColor: colors.gold },
  skip: { minHeight: 44, justifyContent: 'center', paddingRight: 12 },
  skipText: { fontFamily: fonts.semibold, fontSize: 14, color: colors.gold },
  skipJunior: { fontSize: 16 },
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
});

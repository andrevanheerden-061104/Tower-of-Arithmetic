import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import Text from '../../../../components/AppText';
import Icon from '../../../../components/Icon';
import PrimaryButton from '../../../../components/PrimaryButton';
import ArchmageHint from '../../../../components/run/ArchmageHint';
import QuestionBox from './QuestionBox';
import StepsAnswer from './StepsAnswer';
import TapAnswer from './TapAnswer';
import TypeAnswer from './TypeAnswer';
import { colors, fonts, spacing } from '../../../../theme/theme';

// The sheet that slides up when a spell is cast: the sum, a way to answer
// that fits the player's version, and the Archmage's hints.
//   junior        tap one of three answers (TapAnswer)
//   intermediate  type the final answer (TypeAnswer)
//   senior        write each step (StepsAnswer)
export default function CastSheet({ version, spell, question, enemyName, onSubmit, onHint, onClose }) {
  const [panel, setPanel] = useState(null); // null | 'wrong' | 'hit' | 'hint'
  const [hintIndex, setHintIndex] = useState(-1);

  const nextHint = () => {
    setHintIndex((i) => Math.min(i + 1, question.hints.length - 1));
    onHint();
  };

  const submit = (answer) => {
    const result = onSubmit(answer);
    if (result !== 'right') {
      nextHint();
      setPanel(result);
    }
    return result === 'right';
  };

  const showHint = () => {
    nextHint();
    setPanel('hint');
  };

  const Body = version.answerMode === 'tap' ? TapAnswer : version.answerMode === 'type' ? TypeAnswer : StepsAnswer;

  return (
    <View style={styles.scrim}>
      <View style={styles.sheet} accessibilityViewIsModal>
        <View style={styles.header}>
          <View style={styles.headerText}>
            <Text style={styles.casting}>CASTING</Text>
            <Text style={styles.spell} accessibilityRole="header">
              {version.id === 'junior' ? `${spell.name} spell` : spell.name}
            </Text>
          </View>
          {version.id !== 'junior' && panel === null && (
            <Pressable onPress={showHint} accessibilityRole="button" accessibilityLabel="Get a hint" style={styles.iconButton}>
              <Icon name="lightbulb" size={22} color={colors.gold} />
            </Pressable>
          )}
          {version.id === 'junior' && (
            <Pressable
              onPress={() => console.log('Read aloud (placeholder)')}
              accessibilityRole="button"
              accessibilityLabel="Read the question aloud"
              style={[styles.iconButton, styles.speaker]}
            >
              <Icon name="volume" size={22} color={colors.bg} />
            </Pressable>
          )}
          <Pressable onPress={onClose} accessibilityRole="button" accessibilityLabel="Close" style={styles.iconButton}>
            <Icon name="x" size={22} />
          </Pressable>
        </View>

        <ScrollView contentContainerStyle={styles.body} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          {panel ? (
            <>
              <QuestionBox question={question} compact />
              {panel === 'wrong' && (
                <Text style={styles.wrong} accessibilityLiveRegion="assertive">
                  Not quite. No hearts lost, take your time.
                </Text>
              )}
              {panel === 'hit' && (
                <Text style={styles.wrong} accessibilityLiveRegion="assertive">
                  Not quite, and the {enemyName} strikes back! You lose ½ heart.
                </Text>
              )}
              <ArchmageHint hint={question.hints[hintIndex]} index={hintIndex} total={question.hints.length} />
              <PrimaryButton label="Try again" onPress={() => setPanel(null)} />
              {hintIndex < question.hints.length - 1 && (
                <PrimaryButton label="Show another hint" variant="secondary" onPress={nextHint} />
              )}
            </>
          ) : (
            <Body question={question} onSubmit={submit} onHelp={showHint} />
          )}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  scrim: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(13,13,13,0.72)',
    zIndex: 10,
  },
  sheet: {
    maxHeight: '86%',
    paddingTop: 22,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderWidth: 1,
    borderBottomWidth: 0,
    borderColor: '#8C82A3',
    backgroundColor: '#1E1A2B',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: spacing.gutter,
    marginBottom: 14,
  },
  headerText: { flex: 1 },
  casting: { fontFamily: fonts.semibold, fontSize: 12, letterSpacing: 1.2, color: colors.mute },
  spell: { fontFamily: fonts.bold, fontSize: 20, color: colors.white },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  speaker: { backgroundColor: colors.gold, borderColor: colors.gold, borderRadius: 22 },
  body: { gap: 12, paddingHorizontal: spacing.gutter, paddingBottom: spacing.bottom },
  wrong: { fontFamily: fonts.semibold, fontSize: 14, color: '#FF9B8F' },
});

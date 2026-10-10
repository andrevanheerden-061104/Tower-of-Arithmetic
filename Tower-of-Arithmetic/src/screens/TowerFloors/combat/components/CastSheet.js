import { useState } from 'react';
import { Modal, Pressable, StyleSheet, View, useWindowDimensions } from 'react-native';
import Text from '../../../../components/AppText';
import Icon from '../../../../components/Icon';
import PrimaryButton from '../../../../components/PrimaryButton';
import ArchmageHint from '../../../../components/run/ArchmageHint';
import { hearts } from '../../../../game/enemyAI';
import QuestionBox from './QuestionBox';
import SheetBody from './SheetBody';
import StepsAnswer from './StepsAnswer';
import TapAnswer from './TapAnswer';
import TypeAnswer from './TypeAnswer';
import { colors, fonts, spacing } from '../../../../theme/theme';

const MIN_SHEET = 600; // the sheet never gets shorter than this
const HIGHEST = spacing.top + 44 + 8; // just under the menu button

// Where the potion / item columns end (they start under the top bar).
function suppliesBottom(potionSlots, itemCount) {
  const slots = Math.max(potionSlots, itemCount);
  if (!slots) return spacing.top + 44; // just the top bar
  return spacing.top + 60 + 24 + slots * 52;
}

// The sheet that opens when a spell is cast: the sum, a way to answer that
// fits the player's version, and the Archmage's hints.
//   junior        tap one of three answers (TapAnswer)
//   intermediate  type the final answer (TypeAnswer)
//   senior        write each step (StepsAnswer)
//
// It opens in a Modal so it always draws over the whole fight. The top bar,
// potions and items are drawn on top of its dark backdrop in the same
// places, so they don't move and can still be used. The sheet starts below
// them (on short phones it starts higher and covers the lowest slots).
//
// A right answer closes the sheet (the spell hits). A wrong answer shows a
// hint; "Continue" closes it and the enemy takes its turn. Hints asked for
// with the light bulb are free and don't use up the turn.
export default function CastSheet({
  version,
  spell,
  question,
  spellDamage,
  healing,
  potionSlots,
  itemCount,
  hud,
  supplies,
  onSubmit,
  onFizzled,
  onHint,
  onClose,
}) {
  const { height } = useWindowDimensions();
  const [panel, setPanel] = useState(null); // null | 'wrong' | 'hint'
  const [hintIndex, setHintIndex] = useState(-1);
  const [grow, setGrow] = useState(0); // how far the sheet has risen to fit more steps
  const junior = version.id === 'junior';

  const nextHint = () => {
    setHintIndex((i) => Math.min(i + 1, question.hints.length - 1));
    onHint();
  };

  const submit = (answer) => {
    if (onSubmit(answer) === 'wrong') {
      nextHint();
      setPanel('wrong');
    }
  };

  const showHint = () => {
    nextHint();
    setPanel('hint');
  };

  const baseTop = Math.max(HIGHEST, Math.min(suppliesBottom(potionSlots, itemCount) + 8, height - MIN_SHEET));
  const top = baseTop - grow;

  // When the steps no longer fit, raise the sheet by the overflow (never
  // above HIGHEST, never below where it started). Past that they scroll.
  const onOverflow = (extra) => {
    if (Math.abs(extra) < 1) return;
    setGrow((g) => Math.max(0, Math.min(baseTop - HIGHEST, g + extra)));
  };
  const Body = version.answerMode === 'tap' ? TapAnswer : version.answerMode === 'type' ? TypeAnswer : StepsAnswer;

  return (
    <Modal visible transparent animationType="slide" statusBarTranslucent navigationBarTranslucent onRequestClose={panel === 'wrong' ? onFizzled : onClose}>
      <View style={styles.backdrop} />
      {supplies}
      {hud}

      <View style={[styles.sheet, { top }]} accessibilityViewIsModal>
        <View style={styles.header}>
          <View style={styles.headerText}>
            <Text style={styles.casting}>{healing ? 'HEALING' : 'CASTING'} · {hearts(spellDamage).toUpperCase()}</Text>
            <Text style={styles.spell} accessibilityRole="header">
              {junior ? `${spell.name} spell` : spell.name}
            </Text>
          </View>
          {!junior && panel === null && (
            <Pressable onPress={showHint} accessibilityRole="button" accessibilityLabel="Get a hint" style={styles.iconButton}>
              <Icon name="lightbulb" size={22} color={colors.gold} />
            </Pressable>
          )}
          {junior && (
            <Pressable
              onPress={() => console.log('Read aloud (placeholder)')}
              accessibilityRole="button"
              accessibilityLabel="Read the question aloud"
              style={[styles.iconButton, styles.speaker]}
            >
              <Icon name="volume" size={22} color={colors.bg} />
            </Pressable>
          )}
          {panel !== 'wrong' && (
            <Pressable onPress={onClose} accessibilityRole="button" accessibilityLabel="Close" style={styles.iconButton}>
              <Icon name="x" size={22} />
            </Pressable>
          )}
        </View>

        {panel ? (
          <SheetBody
            header={<QuestionBox question={question} compact />}
            scroll={
              <>
                {panel === 'wrong' && (
                  <Text style={styles.wrong} accessibilityLiveRegion="assertive">
                    Not quite. Your spell fizzles, so it’s the enemy’s turn. Here’s a hint for next time:
                  </Text>
                )}
                <ArchmageHint hint={question.hints[hintIndex]} index={hintIndex} total={question.hints.length} />
              </>
            }
            footer={
              panel === 'wrong' ? (
                <PrimaryButton label="Continue" onPress={onFizzled} />
              ) : (
                <>
                  <PrimaryButton label="Back to my answer" onPress={() => setPanel(null)} />
                  {hintIndex < question.hints.length - 1 && (
                    <PrimaryButton label="Show another hint" variant="secondary" onPress={nextHint} />
                  )}
                </>
              )
            }
          />
        ) : (
          <Body question={question} onSubmit={submit} onHelp={showHint} onOverflow={onOverflow} />
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(13,13,13,0.72)' },
  sheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingTop: 16,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderWidth: 1,
    borderBottomWidth: 0,
    borderColor: '#8C82A3',
    backgroundColor: '#1E1A2B',
    overflow: 'hidden',
    zIndex: 5,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: spacing.gutter,
    marginBottom: 10,
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
  wrong: { fontFamily: fonts.semibold, fontSize: 14, lineHeight: 20, color: '#FF9B8F' },
});

import { Pressable, StyleSheet, View } from 'react-native';
import Text from '../../../../components/AppText';
import Icon from '../../../../components/Icon';
import { MAX_DECK } from '../../../../game/spells';
import { speak } from '../../../../audio/speech';
import { colors, fonts, spacing } from '../../../../theme/theme';

// "Your turn · choose a spell" above the hand (or "Slime's turn…" while the
// enemy acts). Junior mode shows only a round read-aloud button on the
// right, just above the cards: tapping it says what to do out loud.
export default function TurnPrompt({ version, deckSize, waiting, enemyName }) {
  const message = waiting ? `${enemyName}’s turn…` : null;
  if (version.id === 'junior') {
    const words = message ?? 'Pick a spell! Tap a card to cast it.';
    return (
      <View style={styles.juniorWrap}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Read aloud: ${words}`}
          onPress={() => speak(words, { slow: true })}
          style={({ pressed }) => [styles.speaker, message && styles.speakerWaiting, pressed && styles.pressed]}
        >
          <Icon name="volume" size={26} color={colors.bg} />
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.row} accessibilityLiveRegion="polite">
      <Text style={[styles.prompt, message && styles.messageText]}>{message ?? 'Your turn · choose a spell'}</Text>
      {!message && (
        <Text style={styles.deck}>
          Deck {deckSize} / {MAX_DECK}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.gutter,
  },
  prompt: { fontFamily: fonts.semibold, fontSize: 16, color: colors.white },
  deck: { fontFamily: fonts.semibold, fontSize: 13, color: colors.gold },
  messageText: { color: colors.mute },
  juniorWrap: { alignItems: 'flex-end', paddingHorizontal: spacing.gutter },
  speaker: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.gold,
    borderWidth: 2,
    borderColor: 'rgba(13,13,13,0.6)',
    shadowColor: colors.gold,
    shadowOpacity: 0.6,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 0 },
    elevation: 6,
  },
  speakerWaiting: { opacity: 0.6 },
  pressed: { opacity: 0.8, transform: [{ scale: 0.95 }] },
});

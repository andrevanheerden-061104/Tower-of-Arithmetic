import { Pressable, StyleSheet, View } from 'react-native';
import Text from '../../../../components/AppText';
import Icon from '../../../../components/Icon';
import { MAX_DECK } from '../../../../game/spells';
import { speak } from '../../../../audio/speech';
import { colors, fonts, spacing } from '../../../../theme/theme';

// "Your turn · choose a spell" above the hand (or "Slime's turn…" while the
// enemy acts). Junior mode shows a bigger, friendlier "Pick a spell!" with a
// read-aloud button that says it out loud, in a block styled like the name
// tags (90% of the screen's width).
export default function TurnPrompt({ version, deckSize, waiting, enemyName }) {
  const message = waiting ? `${enemyName}’s turn…` : null;
  if (version.id === 'junior') {
    return (
      <View style={styles.juniorWrap}>
        <View style={styles.juniorPill}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Read aloud"
            onPress={() => speak(message ?? 'Pick a spell! Tap a card to cast it.', { slow: true })}
            style={styles.speaker}
          >
            <Icon name="volume" size={22} color={colors.bg} />
          </Pressable>
          <Text style={[styles.juniorText, message && styles.messageText]} numberOfLines={1}>
            {message ?? 'Pick a spell!'}
          </Text>
          {/* same width as the speaker, so the words sit in the middle */}
          <View style={styles.balance} />
        </View>
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
  juniorWrap: { alignItems: 'center' },
  juniorPill: {
    width: '90%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 8,
    height: 58,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: colors.gold,
    backgroundColor: 'rgba(13,13,13,0.85)',
    shadowColor: colors.gold,
    shadowOpacity: 0.5,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 0 },
    elevation: 6,
  },
  balance: { width: 44 },
  speaker: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.gold,
  },
  juniorText: { flex: 1, textAlign: 'center', fontFamily: fonts.bold, fontSize: 22, color: colors.white },
});

import { Pressable, StyleSheet, View } from 'react-native';
import Text from '../../../../components/AppText';
import Icon from '../../../../components/Icon';
import { MAX_DECK } from '../../../../game/spells';
import { colors, fonts, spacing } from '../../../../theme/theme';

// "Your turn · choose a spell" above the hand (or "Slime's turn…" while the
// enemy acts). Junior mode shows a bigger, friendlier "Pick a spell!" with a
// read-aloud button instead.
export default function TurnPrompt({ version, deckSize, waiting, enemyName }) {
  const message = waiting ? `${enemyName}’s turn…` : null;
  if (version.id === 'junior') {
    return (
      <View style={styles.juniorWrap}>
        <View style={styles.juniorPill}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Read aloud"
            onPress={() => console.log('Read aloud (placeholder: speech not added yet)')}
            style={styles.speaker}
          >
            <Icon name="volume" size={22} color={colors.bg} />
          </Pressable>
          <Text style={[styles.juniorText, message && styles.messageText]}>{message ?? 'Pick a spell!'}</Text>
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingLeft: 8,
    paddingRight: 20,
    height: 58,
    borderRadius: 29,
    borderWidth: 2,
    borderColor: colors.gold,
    backgroundColor: 'rgba(13,13,13,0.9)',
  },
  speaker: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.gold,
  },
  juniorText: { fontFamily: fonts.bold, fontSize: 22, color: colors.white },
});

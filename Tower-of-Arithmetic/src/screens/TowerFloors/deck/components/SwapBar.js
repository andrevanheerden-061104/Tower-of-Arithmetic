import { Pressable, StyleSheet, View } from 'react-native';
import Text from '../../../../components/AppText';
import PrimaryButton from '../../../../components/PrimaryButton';
import { colors, fonts, spacing } from '../../../../theme/theme';

// The bar at the bottom of the Deck screen: tells the player what to tap
// next and gives the move button for the picked card.
export default function SwapBar({ locked, picked, deckFull, deckSize, hasStash, onMoveToStash, onMoveToDeck, onCancel }) {
  let text;
  let button = null;

  if (locked) {
    text = 'You can change your deck after this fight.';
  } else if (picked?.area === 'deck') {
    text = hasStash ? 'Tap a stash card to swap them.' : 'Move this card to your stash?';
    button =
      deckSize > 1 ? (
        <PrimaryButton label="Move to stash" variant="secondary" onPress={onMoveToStash} />
      ) : (
        <Text style={styles.warn}>Your deck needs at least 1 card.</Text>
      );
  } else if (picked?.area === 'stash') {
    text = deckFull ? 'Tap a deck card to swap them.' : 'Tap an empty slot, or add it to your deck.';
    if (!deckFull) button = <PrimaryButton label="Add to deck" variant="secondary" onPress={onMoveToDeck} />;
  } else {
    text = hasStash ? 'Tap a card to swap it between your deck and stash.' : 'Tap a card to move it.';
  }

  return (
    <View style={styles.bar} accessibilityLiveRegion="polite">
      <View style={styles.row}>
        <Text style={styles.text}>{text}</Text>
        {picked && !locked && (
          <Pressable onPress={onCancel} accessibilityRole="button" style={styles.cancel}>
            <Text style={styles.cancelText}>Cancel</Text>
          </Pressable>
        )}
      </View>
      {button}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    gap: 12,
    paddingTop: 16,
    paddingBottom: spacing.bottom,
    paddingHorizontal: spacing.gutter,
    borderTopWidth: 1,
    borderTopColor: colors.line,
    backgroundColor: colors.panel,
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  text: { flex: 1, fontFamily: fonts.semibold, fontSize: 15, lineHeight: 21, color: colors.white },
  warn: { fontFamily: fonts.medium, fontSize: 14, color: colors.pink, textAlign: 'center' },
  cancel: { minHeight: 44, minWidth: 64, alignItems: 'center', justifyContent: 'center' },
  cancelText: { fontFamily: fonts.semibold, fontSize: 15, color: colors.gold },
});

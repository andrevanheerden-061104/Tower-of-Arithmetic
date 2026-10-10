import { StyleSheet, View, useWindowDimensions } from 'react-native';
import Text from '../../../../components/AppText';
import SpellCardImage from '../../../../components/run/SpellCardImage';
import { colors, fonts, spacing } from '../../../../theme/theme';

// The deck as cards, two across, with dashed empty slots for the rest.
export default function DeckGrid({ deck, cardSet, slots }) {
  const { width } = useWindowDimensions();
  const cardWidth = (Math.min(width, 440) - spacing.gutter * 2 - 14) / 2;
  const empty = Math.max(0, slots - deck.length);

  return (
    <View style={styles.grid}>
      {deck.map((id, i) => (
        <SpellCardImage key={`${id}-${i}`} spellId={id} cardSet={cardSet} width={cardWidth} />
      ))}
      {Array.from({ length: empty }, (_, i) => (
        <View key={`empty-${i}`} style={[styles.empty, { width: cardWidth, height: cardWidth * 1.4 }]}>
          <Text style={styles.emptyText}>Empty slot</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 14 },
  empty: {
    borderRadius: 12,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: { fontFamily: fonts.medium, fontSize: 13, color: colors.mute },
});

import { Pressable, StyleSheet, View, useWindowDimensions } from 'react-native';
import Text from '../../../../components/AppText';
import { colors, fonts, spacing } from '../../../../theme/theme';
import PickableCard from './PickableCard';

export const GRID_GAP = 8;

// Card width for three cards across (the card's ring adds 10 px).
export function useCardWidth() {
  const { width } = useWindowDimensions();
  return (Math.min(width, 440) - spacing.gutter * 2 - GRID_GAP * 2) / 3 - 10;
}

// The deck: up to 5 cards, three across, with dashed empty slots.
// An empty slot can be tapped when a stash card is picked.
export default function DeckGrid({ deck, cardSet, slots, picked, locked, onPick, onEmptySlot }) {
  const cardWidth = useCardWidth();
  const empty = Math.max(0, slots - deck.length);

  return (
    <View style={styles.grid}>
      {deck.map((id, i) => (
        <PickableCard
          key={`${id}-${i}`}
          spellId={id}
          cardSet={cardSet}
          width={cardWidth}
          picked={picked === i}
          disabled={locked}
          where={`deck slot ${i + 1}`}
          onPress={() => onPick(i)}
        />
      ))}
      {Array.from({ length: empty }, (_, i) => (
        <Pressable
          key={`empty-${i}`}
          onPress={onEmptySlot}
          disabled={!onEmptySlot}
          accessibilityRole="button"
          accessibilityLabel={onEmptySlot ? 'Empty deck slot. Tap to move the picked card here' : 'Empty deck slot'}
          accessibilityState={{ disabled: !onEmptySlot }}
          style={[
            styles.empty,
            { width: cardWidth + 10, height: cardWidth * 1.4 + 10 },
            onEmptySlot && styles.emptyActive,
          ]}
        >
          <Text style={[styles.emptyText, onEmptySlot && styles.emptyTextActive]}>
            {onEmptySlot ? 'Move here' : 'Empty slot'}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: GRID_GAP },
  empty: {
    borderRadius: 12,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyActive: { borderColor: colors.gold, backgroundColor: 'rgba(242,234,121,0.08)' },
  emptyText: { fontFamily: fonts.medium, fontSize: 13, color: colors.mute, textAlign: 'center' },
  emptyTextActive: { fontFamily: fonts.semibold, color: colors.gold },
});

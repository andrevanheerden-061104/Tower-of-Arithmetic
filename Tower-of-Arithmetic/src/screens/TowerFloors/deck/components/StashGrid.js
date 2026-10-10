import { StyleSheet, View } from 'react-native';
import Text from '../../../../components/AppText';
import { colors, fonts } from '../../../../theme/theme';
import { GRID_GAP, useCardWidth } from './DeckGrid';
import PickableCard from './PickableCard';

// Every collected card that isn't in the deck, three across.
export default function StashGrid({ stash, cardSet, picked, locked, onPick }) {
  const cardWidth = useCardWidth();

  if (!stash.length) {
    return (
      <View style={styles.emptyBox}>
        <Text style={styles.emptyText}>Your stash is empty.</Text>
      </View>
    );
  }

  return (
    <View style={styles.grid}>
      {stash.map((id, i) => (
        <PickableCard
          key={`${id}-${i}`}
          spellId={id}
          cardSet={cardSet}
          width={cardWidth}
          picked={picked === i}
          disabled={locked}
          where="in your stash"
          onPress={() => onPick(i)}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: GRID_GAP },
  emptyBox: {
    height: 64,
    borderRadius: 12,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: { fontFamily: fonts.medium, fontSize: 13, color: colors.mute },
});

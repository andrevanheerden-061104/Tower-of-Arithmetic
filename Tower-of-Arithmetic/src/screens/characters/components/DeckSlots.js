import { StyleSheet, View } from 'react-native';
import Text from '../../../components/AppText';
import { colors, fonts } from '../../../theme/theme';

// "Deck · 1 of 5 spells" with a row of slots, filled ones first.
export default function DeckSlots({ filled = 1, total = 5 }) {
  return (
    <View style={styles.wrap} accessibilityLabel={`Deck, ${filled} of ${total} spells`}>
      <Text style={styles.label}>
        Deck · {filled} of {total} spells
      </Text>
      <View style={styles.row}>
        {Array.from({ length: total }, (_, i) => (
          <View key={i} style={[styles.slot, i < filled && styles.slotFilled]} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 6, marginTop: 6 },
  label: { fontFamily: fonts.semibold, fontSize: 12, color: colors.gold },
  row: { flexDirection: 'row', gap: 8 },
  slot: {
    width: 26,
    height: 34,
    borderRadius: 5,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.border,
  },
  slotFilled: {
    borderWidth: 1.5,
    borderStyle: 'solid',
    borderColor: colors.gold,
    backgroundColor: colors.indigo,
  },
});

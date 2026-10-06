import { StyleSheet, Text, View } from 'react-native';
import Icon from '../../../components/Icon';
import DeckSlots from './DeckSlots';
import SpellCard from './SpellCard';
import { colors, fonts } from '../../../theme/theme';

// The spell this character starts each run with, shown as a card
// with its name, effect and the deck size beside it.
export default function StartingSpell({ spell }) {
  return (
    <View style={styles.wrap}>
      <SpellCard spell={spell} />

      <View style={styles.details}>
        <Text style={styles.label}>Starting spell</Text>
        <Text style={styles.name}>{spell.name}</Text>
        <Text style={styles.type}>{spell.type}</Text>
        <View style={styles.effect}>
          <Icon name="heart" size={14} color={colors.pink} fill={colors.pink} />
          <Text style={styles.effectText}>{spell.effect}</Text>
        </View>
        <DeckSlots filled={1} total={5} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  details: { flex: 1, gap: 3 },
  label: {
    fontFamily: fonts.semibold,
    fontSize: 12,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    color: colors.mute,
  },
  name: { fontFamily: fonts.bold, fontSize: 18, color: colors.white },
  type: { fontFamily: fonts.semibold, fontSize: 12, color: colors.gold },
  effect: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  effectText: { flex: 1, fontFamily: fonts.medium, fontSize: 13, color: colors.white },
});

import { Image, StyleSheet, Text, View } from 'react-native';
import { colors, fonts } from '../../../theme/theme';

const WIDTH = 96;
const HEIGHT = Math.round(WIDTH * 1.4); // the card art is 1500 x 2100

// A spell card. Uses the card artwork when the spell has some;
// otherwise it draws a plain placeholder card with the spell's name.
export default function SpellCard({ spell }) {
  if (spell.cardImage) {
    return (
      <Image
        source={spell.cardImage}
        style={styles.card}
        resizeMode="contain"
        accessibilityLabel={`${spell.name} spell card`}
      />
    );
  }

  return (
    <View style={[styles.card, styles.placeholder]} accessibilityLabel={`${spell.name} spell card`}>
      <Text style={styles.name}>{spell.name}</Text>
      <View style={styles.orb} />
      <Text style={styles.type}>ATTACK</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { width: WIDTH, height: HEIGHT, borderRadius: 8 },
  placeholder: {
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 6,
    borderWidth: 1.5,
    borderColor: colors.gold,
    backgroundColor: colors.indigo,
  },
  name: { fontFamily: fonts.bold, fontSize: 12, color: colors.white, textAlign: 'center' },
  orb: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: colors.violet,
    backgroundColor: colors.bg,
  },
  type: {
    fontFamily: fonts.bold,
    fontSize: 12,
    letterSpacing: 1,
    color: colors.white,
    paddingVertical: 2,
    paddingHorizontal: 10,
    borderRadius: 9,
    overflow: 'hidden',
    backgroundColor: colors.bg,
  },
});

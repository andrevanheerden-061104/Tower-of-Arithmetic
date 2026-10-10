import { Image, StyleSheet } from 'react-native';
import { cardImage, getSpell } from '../../game/spells';

// A spell card picture at any width (cards are 1500 x 2100, ratio 1 : 1.4).
export default function SpellCardImage({ spellId, cardSet = 'standard', width, style }) {
  const spell = getSpell(spellId);
  return (
    <Image
      source={cardImage(spellId, cardSet)}
      style={[styles.card, { width, height: width * 1.4, borderRadius: width * 0.06 }, style]}
      resizeMode="contain"
      accessibilityLabel={`${spell.name} spell card`}
    />
  );
}

const styles = StyleSheet.create({
  card: {},
});

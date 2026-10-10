import { Pressable, StyleSheet } from 'react-native';
import SpellCardImage from '../../../../components/run/SpellCardImage';
import { getSpell } from '../../../../game/spells';
import { colors } from '../../../../theme/theme';

// A spell card that can be tapped to pick it (gold ring when picked).
export default function PickableCard({ spellId, cardSet, width, picked, disabled, onPress, where }) {
  const spell = getSpell(spellId);
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={`${spell.name}, ${where}`}
      accessibilityState={{ selected: picked, disabled }}
      style={({ pressed }) => [styles.wrap, { borderRadius: width * 0.08 }, picked && styles.picked, pressed && styles.pressed]}
    >
      <SpellCardImage spellId={spellId} cardSet={cardSet} width={width} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: { borderWidth: 3, borderColor: 'transparent', padding: 2 },
  picked: {
    borderColor: colors.gold,
    shadowColor: colors.gold,
    shadowOpacity: 0.6,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 0 },
    elevation: 8,
  },
  pressed: { opacity: 0.85 },
});

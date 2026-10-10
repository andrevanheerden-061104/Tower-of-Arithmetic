import { Pressable, StyleSheet, View, useWindowDimensions } from 'react-native';
import Icon from '../../../../components/Icon';
import SpellCardImage from '../../../../components/run/SpellCardImage';
import { colors } from '../../../../theme/theme';

// One big card at a time, with arrows to see the others.
export default function CardCarousel({ spells, index, onChange, cardSet }) {
  const { width } = useWindowDimensions();
  const cardWidth = Math.min(270, width - 120);
  const go = (step) => onChange((index + step + spells.length) % spells.length);

  return (
    <View style={styles.stage}>
      <SpellCardImage spellId={spells[index]} cardSet={cardSet} width={cardWidth} />
      <Arrow side="left" onPress={() => go(-1)} />
      <Arrow side="right" onPress={() => go(1)} />
    </View>
  );
}

function Arrow({ side, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={side === 'left' ? 'Previous card' : 'Next card'}
      style={({ pressed }) => [styles.arrow, side === 'left' ? styles.left : styles.right, pressed && styles.pressed]}
    >
      <Icon name={side === 'left' ? 'chevronLeft' : 'chevronRight'} size={24} color={colors.gold} strokeWidth={2.5} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  stage: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  arrow: {
    position: 'absolute',
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: colors.gold,
    backgroundColor: 'rgba(13,13,13,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  left: { left: -8 },
  right: { right: -8 },
  pressed: { opacity: 0.75 },
});

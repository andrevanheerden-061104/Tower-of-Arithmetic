import { Pressable, StyleSheet, View } from 'react-native';
import Text from '../../../../components/AppText';
import ItemIcon from '../../../../components/run/ItemIcon';
import { ITEMS, POTIONS } from '../../../../game/encounters';
import { isCursed } from '../../../../game/run';
import { colors, fonts, spacing } from '../../../../theme/theme';

const POTION_SLOTS = 4;

// Potions (left, tap to drink) or items (right) down the side of a fight.
export default function SupplyColumn({ side, title, kind, run, onUse }) {
  const potions = kind === 'potions';
  const place = side === 'left' ? { left: 24 } : { right: 24 };

  return (
    <View style={[styles.column, place]}>
      <Text style={styles.title}>{title}</Text>
      {potions
        ? Array.from({ length: POTION_SLOTS }, (_, i) => {
            const id = run.potions[i];
            if (!id) return <View key={i} style={styles.empty} accessibilityLabel="Empty potion slot" />;
            const potion = POTIONS[id];
            return (
              <Pressable
                key={i}
                onPress={() => onUse(i)}
                accessibilityRole="button"
                accessibilityLabel={`${potion.name}: ${potion.effect}. Tap to drink`}
                style={({ pressed }) => [styles.slot, pressed && styles.pressed]}
              >
                <ItemIcon kind="potion" potionColor={potion.color} size={30} />
              </Pressable>
            );
          })
        : run.items.map((id) => {
            const item = ITEMS[id];
            return (
              <View key={id} style={styles.slot} accessible accessibilityLabel={`${item.name}: ${item.effect}${isCursed(run, id) ? `. Cursed: ${item.curse}` : ''}`}>
                <ItemIcon kind={item.icon} size={30} cursed={isCursed(run, id)} />
              </View>
            );
          })}
    </View>
  );
}

const styles = StyleSheet.create({
  column: { position: 'absolute', top: spacing.top + 60, alignItems: 'center', gap: 8, zIndex: 1 },
  title: { fontFamily: fonts.medium, fontSize: 12, color: colors.white, marginBottom: 2 },
  slot: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  pressed: { opacity: 0.6 },
  empty: {
    width: 32,
    height: 32,
    margin: 6,
    borderRadius: 16,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: colors.mute,
    backgroundColor: 'rgba(13,13,13,0.5)',
  },
});

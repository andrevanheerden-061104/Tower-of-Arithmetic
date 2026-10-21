import { Pressable, StyleSheet, View } from 'react-native';
import Text from '../../../../components/AppText';
import ItemIcon from '../../../../components/run/ItemIcon';
import { ITEMS, POTIONS } from '../../../../game/encounters';
import { isCursed, potionSlots } from '../../../../game/run';
import TutorialTarget from '../../../../components/tutorial/TutorialTarget';
import { colors, fonts, spacing } from '../../../../theme/theme';

// Potions (left) or items (right) down the side of a fight. Tapping one
// opens its popup (SupplyDetails), where a potion can be drunk.
export default function SupplyColumn({ side, title, kind, run, onOpen, tutorialId }) {
  const potions = kind === 'potions';
  const place = side === 'left' ? { left: 24 } : { right: 24 };

  return (
    <View style={[styles.column, place]}>
      {tutorialId && <TutorialTarget id={tutorialId} />}
      <Text style={styles.title}>{title}</Text>
      {potions
        ? Array.from({ length: potionSlots(run) }, (_, i) => {
            const id = run.potions[i];
            if (!id) return <View key={i} style={styles.empty} accessibilityLabel="Empty potion slot" />;
            const potion = POTIONS[id];
            return (
              <Pressable
                key={i}
                onPress={() => onOpen({ kind: 'potion', index: i })}
                accessibilityRole="button"
                accessibilityLabel={`${potion.name}: ${potion.effect}. Tap to see it and drink it`}
                style={({ pressed }) => [styles.slot, pressed && styles.pressed]}
              >
                <ItemIcon kind={id} size={34} />
              </Pressable>
            );
          })
        : run.items.map((id) => {
            const item = ITEMS[id];
            return (
              <Pressable
                key={id}
                onPress={() => onOpen({ kind: 'item', id })}
                accessibilityRole="button"
                accessibilityLabel={`${item.name}: ${item.effect}${isCursed(run, id) ? `. Cursed: ${item.curse}` : ''}. Tap to see what it does`}
                style={({ pressed }) => [styles.slot, pressed && styles.pressed]}
              >
                <ItemIcon kind={id} size={34} cursed={isCursed(run, id)} />
              </Pressable>
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

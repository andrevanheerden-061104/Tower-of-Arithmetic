import { Pressable, StyleSheet, View } from 'react-native';
import Text from '../../../../components/AppText';
import SpellCardImage from '../../../../components/run/SpellCardImage';
import { juniorOpLabel } from '../../../../game/questions';
import { getSpell } from '../../../../game/spells';
import { colors, fonts } from '../../../../theme/theme';

// The spell cards in hand. Tap a card to cast it.
// Standard: three cards fanned out at the bottom, the chosen one raised.
// Junior: three cards in a row, each with a tag saying what sum it casts.
export default function SpellHand({ hand, version, dungeonTypeId, selected, disabled, onPick }) {
  if (version.id === 'junior') {
    return (
      <View style={styles.juniorRow}>
        {hand.map((id, i) => {
          const spell = getSpell(id);
          const op = juniorOpLabel(version, dungeonTypeId, spell);
          const on = selected === i;
          return (
            <Pressable
              key={`${id}-${i}`}
              onPress={() => onPick(i)}
              disabled={disabled}
              accessibilityRole="button"
              accessibilityState={{ disabled }}
              accessibilityLabel={`${spell.name}: ${op?.label ?? ''}. Tap to cast`}
              style={({ pressed }) => [styles.juniorCard, on && styles.juniorOn, disabled && styles.waiting, pressed && styles.pressed]}
            >
              <SpellCardImage spellId={id} cardSet="junior" width={100} />
              {op && (
                <View style={[styles.tag, on && styles.tagOn]}>
                  <Text style={[styles.tagText, on && styles.tagTextOn]} numberOfLines={1}>
                    {op.label} {op.symbol}
                  </Text>
                </View>
              )}
            </Pressable>
          );
        })}
      </View>
    );
  }

  const fan = [
    { rotate: '-6deg', left: 12, bottom: -18 },
    { rotate: '0deg', left: 134, bottom: 10 },
    { rotate: '6deg', left: 256, bottom: -4 },
  ];

  return (
    <View style={styles.fan}>
      {hand.map((id, i) => {
        const spell = getSpell(id);
        const place = fan[i] ?? fan[1];
        const on = selected === i;
        return (
          <Pressable
            key={`${id}-${i}`}
            onPress={() => onPick(i)}
            disabled={disabled}
            accessibilityRole="button"
            accessibilityState={{ disabled }}
            accessibilityLabel={`${spell.name}, ${spell.element.toLowerCase()} spell. Tap to cast`}
            style={({ pressed }) => [
              styles.fanCard,
              { left: place.left, bottom: place.bottom + (on ? 14 : 0), transform: [{ rotate: place.rotate }] },
              on && styles.fanOn,
              disabled && styles.waiting,
              pressed && styles.pressed,
            ]}
          >
            <SpellCardImage spellId={id} width={135} />
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  fan: { height: 200, width: 402, alignSelf: 'center' },
  fanCard: { position: 'absolute', borderRadius: 9 },
  fanOn: {
    zIndex: 2,
    shadowColor: colors.gold,
    shadowOpacity: 0.8,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 0 },
    elevation: 10,
  },
  pressed: { opacity: 0.85 },
  waiting: { opacity: 0.55 },
  juniorRow: { flexDirection: 'row', justifyContent: 'center', gap: 12, paddingBottom: 28 },
  juniorCard: { borderRadius: 9, borderWidth: 3, borderColor: 'transparent' },
  juniorOn: { borderColor: colors.gold },
  tag: {
    position: 'absolute',
    bottom: 8,
    alignSelf: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.gold,
    backgroundColor: 'rgba(13,13,13,0.9)',
  },
  tagOn: { backgroundColor: colors.gold },
  tagText: { fontFamily: fonts.bold, fontSize: 12, color: colors.gold },
  tagTextOn: { color: colors.bg },
});

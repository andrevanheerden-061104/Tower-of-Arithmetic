import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import Text from '../../../../components/AppText';
import Icon from '../../../../components/Icon';
import PrimaryButton from '../../../../components/PrimaryButton';
import HeartRow, { formatHearts } from '../../../../components/run/HeartRow';
import ItemIcon from '../../../../components/run/ItemIcon';
import { ITEMS, POTIONS } from '../../../../game/encounters';
import { isCursed } from '../../../../game/run';
import { colors, fonts, spacing } from '../../../../theme/theme';

// (written out: StyleSheet.absoluteFillObject is gone in React Native 0.86)
const FILL = { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 };

// The popup when a potion or an item is tapped in a fight (Figma: 10a
// Potion details, 10b Item details). It shows the picture, what it does
// and, for a potion, the player's hearts now and after drinking.
//   detail    { kind: 'potion', index } or { kind: 'item', id }
//   canDrink  false while the enemy is taking its turn
// Potions can be drunk from here (it doesn't use up the turn); items only
// explain themselves, as they work on their own.
export default function SupplyDetails({ run, detail, canDrink, onDrink, onClose }) {
  const potionId = detail.kind === 'potion' ? run.potions[detail.index] : null;
  const potion = potionId ? POTIONS[potionId] : null;
  const item = detail.kind === 'item' ? ITEMS[detail.id] : null;
  const thing = potion ?? item;
  if (!thing) return null;

  const cursed = item ? isCursed(run, item.id) : false;
  const after = potion ? Math.min(run.maxHearts, run.hearts + potion.heal) : run.hearts;
  const full = potion && run.hearts >= run.maxHearts;
  const badge = potion ? 'POTION · HEALING' : cursed ? 'ITEM · CURSED' : 'ITEM · ALWAYS ON';
  const glow = potion ? 'rgba(224,64,84,0.45)' : cursed ? 'rgba(160,110,255,0.45)' : 'rgba(115,200,255,0.4)';
  const phoenixUsed = item?.id === 'phoenixCharm' && run.phoenixUsed;

  let drinkLabel = 'Drink potion';
  if (!canDrink) drinkLabel = 'Wait for your turn';
  else if (full) drinkLabel = 'Your hearts are full';

  return (
    <View style={styles.cover} accessibilityViewIsModal>
      <Pressable style={styles.backdrop} onPress={onClose} accessibilityRole="button" accessibilityLabel="Close" />
      <View style={styles.card}>
        <ScrollView contentContainerStyle={styles.cardContent} showsVerticalScrollIndicator={false} bounces={false}>
          <View style={styles.header}>
            <View style={[styles.badge, cursed && styles.badgeCursed]}>
              <Text style={styles.badgeText}>{badge}</Text>
            </View>
            <Pressable onPress={onClose} accessibilityRole="button" accessibilityLabel="Close" style={({ pressed }) => [styles.close, pressed && styles.pressed]}>
              <Icon name="x" size={20} />
            </Pressable>
          </View>

          <View style={styles.art} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
            <View style={[styles.glow, { boxShadow: `0px 0px 48px 26px ${glow}`, backgroundColor: glow }]} />
            <View style={styles.pedestal} />
            <ItemIcon kind={potionId ?? item.id} size={118} cursed={cursed} />
          </View>

          <Text style={styles.name} accessibilityRole="header">
            {thing.name}
          </Text>

          <View style={styles.effect}>
            <Icon name={potion ? 'heart' : cursed ? 'skull' : 'sparkles'} size={18} color={potion ? colors.pink : colors.gold} />
            <Text style={styles.effectText}>{thing.effect}</Text>
          </View>

          {thing.about ? <Text style={styles.about}>{thing.about}{potion ? ' Drinking doesn’t use up your turn.' : ''}</Text> : null}

          {potion ? (
            <View style={styles.panel}>
              <Text style={styles.label}>YOUR HEARTS</Text>
              <View style={styles.heartsRow}>
                <View style={styles.heartsCol}>
                  <HeartRow hearts={run.hearts} max={run.maxHearts} size={20} />
                  <Text style={styles.heartsLabel}>Now · {formatHearts(run.hearts)} / {run.maxHearts}</Text>
                </View>
                <Icon name="chevronRight" size={20} color={colors.gold} strokeWidth={2.5} />
                <View style={styles.heartsCol}>
                  <HeartRow hearts={after} max={run.maxHearts} size={20} />
                  <Text style={[styles.heartsLabel, styles.heartsAfter]}>After · {formatHearts(after)} / {run.maxHearts}</Text>
                </View>
              </View>
            </View>
          ) : (
            <View style={styles.panel}>
              <InfoRow icon="play" label="WHEN" value={item.when ?? 'All run long'} />
              <InfoRow icon="sparkles" label="HOW TO USE" value={phoenixUsed ? 'Already used this run' : 'Nothing to tap: it’s always on'} />
              {cursed && <InfoRow icon="skull" label="CURSE" value={`${item.curse}. A campfire can burn it away.`} warn />}
            </View>
          )}

          {potion ? (
            <PrimaryButton label={drinkLabel} disabled={!canDrink || full} onPress={onDrink} />
          ) : (
            <PrimaryButton label="Close" variant="secondary" onPress={onClose} />
          )}
        </ScrollView>
      </View>
    </View>
  );
}

function InfoRow({ icon, label, value, warn }) {
  return (
    <View style={styles.infoRow}>
      <View style={[styles.infoIcon, warn && styles.infoIconWarn]}>
        <Icon name={icon} size={18} color={warn ? '#FF9B8F' : colors.gold} />
      </View>
      <View style={styles.infoWords}>
        <Text style={styles.label}>{label}</Text>
        <Text style={[styles.infoValue, warn && styles.warn]}>{value}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cover: { ...FILL, zIndex: 60, elevation: 60, justifyContent: 'flex-end', paddingHorizontal: 24, paddingBottom: spacing.bottom },
  backdrop: { ...FILL, backgroundColor: 'rgba(13,10,20,0.78)' },
  // Sits low so the tapped potion or item stays in sight at the top
  card: {
    maxHeight: '78%',
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: colors.gold,
    backgroundColor: '#1E1A2B',
    boxShadow: '0px 0px 32px rgba(242,234,121,0.18)',
    overflow: 'hidden',
  },
  cardContent: { alignItems: 'stretch', gap: 12, paddingTop: 20, paddingBottom: 24, paddingHorizontal: 24 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  badge: { paddingVertical: 6, paddingHorizontal: 14, borderRadius: 999, backgroundColor: colors.gold },
  badgeCursed: { backgroundColor: '#C9A8FF' },
  badgeText: { fontFamily: fonts.bold, fontSize: 11, letterSpacing: 1.2, color: colors.bg },
  close: {
    width: 44,
    height: 44,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.panel,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: { opacity: 0.75 },
  art: { height: 132, alignItems: 'center', justifyContent: 'center' },
  glow: { position: 'absolute', width: 96, height: 96, borderRadius: 48, opacity: 0.6 },
  pedestal: { position: 'absolute', bottom: 2, width: 118, height: 16, borderRadius: 59, backgroundColor: 'rgba(76,51,166,0.55)' },
  name: { fontFamily: fonts.display, fontSize: 24, letterSpacing: 0.5, color: colors.gold, textAlign: 'center' },
  effect: {
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
    paddingLeft: 12,
    paddingRight: 16,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(242,234,121,0.6)',
    backgroundColor: '#2A1F5C',
    maxWidth: '100%',
  },
  effectText: { flexShrink: 1, fontFamily: fonts.semibold, fontSize: 15, color: colors.white },
  about: { fontFamily: fonts.medium, fontSize: 15, lineHeight: 22, color: colors.mute, textAlign: 'center' },
  panel: { gap: 12, padding: 16, borderRadius: 16, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.panel },
  label: { fontFamily: fonts.semibold, fontSize: 11, letterSpacing: 1.2, color: colors.mute },
  heartsRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  heartsCol: { alignItems: 'center', gap: 4, flexShrink: 1 },
  heartsLabel: { fontFamily: fonts.medium, fontSize: 12, color: colors.mute },
  heartsAfter: { fontFamily: fonts.bold, color: colors.gold },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  infoIcon: { width: 36, height: 36, borderRadius: 10, backgroundColor: '#2A1F5C', alignItems: 'center', justifyContent: 'center' },
  infoIconWarn: { backgroundColor: 'rgba(255,155,143,0.15)' },
  infoWords: { flex: 1, gap: 2 },
  infoValue: { fontFamily: fonts.semibold, fontSize: 14, color: colors.white },
  warn: { color: '#FF9B8F' },
});

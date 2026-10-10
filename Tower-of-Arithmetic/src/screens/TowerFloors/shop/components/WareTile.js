import { Pressable, StyleSheet, View } from 'react-native';
import Text from '../../../../components/AppText';
import CoinIcon from '../../../../components/run/CoinIcon';
import ItemIcon from '../../../../components/run/ItemIcon';
import SpellCardImage from '../../../../components/run/SpellCardImage';
import { ITEMS, POTIONS } from '../../../../game/encounters';
import { colors, fonts } from '../../../../theme/theme';

// One thing for sale: picture, name and price. Shows how many more coins
// are needed when the player can't afford it yet.
export default function WareTile({ ware, coins, sold, selected, onPress }) {
  const short = ware.price - coins;
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="radio"
      accessibilityState={{ checked: selected, disabled: sold }}
      accessibilityLabel={`${ware.name}, ${ware.price} coins${sold ? ', sold' : short > 0 ? `, need ${short} more` : ''}`}
      style={({ pressed }) => [styles.tile, selected && styles.selected, sold && styles.sold, pressed && styles.pressed]}
    >
      <View style={styles.art}>
        {ware.kind === 'spell' ? (
          <SpellCardImage spellId={ware.spellId} width={50} />
        ) : ware.kind === 'potion' ? (
          <ItemIcon kind="potion" potionColor={POTIONS[ware.potionId].color} size={44} />
        ) : (
          <ItemIcon kind={ITEMS[ware.itemId].icon} size={44} />
        )}
      </View>
      <Text style={styles.name} numberOfLines={1}>
        {ware.name}
      </Text>
      <View style={[styles.price, short > 0 && !sold && styles.priceShort]}>
        <CoinIcon size={16} />
        <Text style={styles.priceText}>{sold ? 'Sold' : ware.price}</Text>
      </View>
      {short > 0 && !sold && <Text style={styles.need}>Need {short} more</Text>}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tile: {
    flex: 1,
    minHeight: 140,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.panel,
  },
  selected: { borderWidth: 2, borderColor: colors.gold, backgroundColor: '#2A1F5C' },
  sold: { opacity: 0.5 },
  pressed: { opacity: 0.85 },
  art: { height: 72, justifyContent: 'center' },
  name: { fontFamily: fonts.semibold, fontSize: 13, color: colors.white },
  price: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
    backgroundColor: colors.bg,
  },
  priceShort: { borderWidth: 1, borderColor: '#FF9B8F' },
  priceText: { fontFamily: fonts.bold, fontSize: 13, color: colors.white },
  need: { fontFamily: fonts.semibold, fontSize: 11, color: '#FF9B8F' },
});

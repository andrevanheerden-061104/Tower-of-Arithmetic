import { StyleSheet, View, useWindowDimensions } from 'react-native';
import Text from '../../../../components/AppText';
import HeartRow, { formatHearts } from '../../../../components/run/HeartRow';
import { colors, fonts } from '../../../../theme/theme';

// Hearts and name for one fighter. The player's sits bottom left; a normal
// enemy's floats above its head; the boss's sits level with the player's.
export default function HealthPanel({ side, name, hearts, max, boss }) {
  const { width } = useWindowDimensions();
  const k = width / 402;
  const place =
    side === 'left'
      ? { left: 32, bottom: 249 * k }
      : boss
        ? { right: 32, bottom: 249 * k }
        : { left: 219 * k, bottom: 409 * k };

  return (
    <View style={[styles.wrap, place]} accessible accessibilityLabel={`${name}: ${formatHearts(hearts)} of ${max} hearts`}>
      <View style={styles.hearts}>
        <HeartRow hearts={hearts} max={max} size={18} gap={3} />
        <View style={styles.divider} />
        <Text style={styles.count}>
          {formatHearts(hearts)} / {max}
        </Text>
      </View>
      <View style={styles.name}>
        <Text style={styles.nameText}>{name}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { position: 'absolute', alignItems: 'center', gap: 6 },
  hearts: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    height: 34,
    borderRadius: 17,
    borderWidth: 1.5,
    borderColor: colors.gold,
    backgroundColor: 'rgba(13,13,13,0.85)',
  },
  divider: { width: 1, height: 16, backgroundColor: colors.border },
  count: { fontFamily: fonts.bold, fontSize: 14, color: colors.white },
  name: {
    paddingHorizontal: 12,
    paddingVertical: 2,
    borderRadius: 8,
    backgroundColor: 'rgba(13,13,13,0.8)',
  },
  nameText: { fontFamily: fonts.bold, fontSize: 14, letterSpacing: 2, textTransform: 'uppercase', color: colors.white },
});

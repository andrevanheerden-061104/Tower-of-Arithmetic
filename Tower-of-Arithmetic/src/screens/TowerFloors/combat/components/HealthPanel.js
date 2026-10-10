import { StyleSheet, View, useWindowDimensions } from 'react-native';
import Text from '../../../../components/AppText';
import HeartRow, { formatHearts } from '../../../../components/run/HeartRow';
import { colors, fonts } from '../../../../theme/theme';

// Glowing aura colours for whoever's turn it is.
const AURAS = {
  gold: {
    edge: '#F2EA79',
    fill: '#2A1E07',
    text: '#FFF8D6',
    glow: '0px 0px 6px rgba(242,234,121,0.55), 0px 0px 14px rgba(242,234,121,0.3)',
    textGlow: 'rgba(242,234,121,0.8)',
  },
  shadow: {
    edge: '#C084FC',
    fill: '#2A0B2E',
    text: '#FBEAFF',
    glow: '0px 0px 6px rgba(168,85,247,0.6), 0px 0px 14px rgba(224,69,123,0.3)',
    textGlow: 'rgba(192,132,252,0.9)',
  },
};

// Hearts and name for one fighter. The player's sits bottom left; a normal
// enemy's floats above its head; the boss's sits level with the player's.
// The fighter whose turn it is (`active`) gets a glowing aura round both
// the hearts bar and the name; the one who's waiting has no outline.
export default function HealthPanel({ side, name, hearts, max, boss, active, aura = 'gold' }) {
  const a = AURAS[aura];
  const glowBox = active ? { borderColor: a.edge, backgroundColor: a.fill, boxShadow: a.glow } : styles.idle;
  const { width } = useWindowDimensions();
  const k = width / 402;
  const place =
    side === 'left'
      ? { left: 32, bottom: 249 * k }
      : boss
        ? { right: 32, bottom: 249 * k }
        : { left: 219 * k, bottom: 409 * k };

  return (
    <View
      style={[styles.wrap, place]}
      accessible
      accessibilityLabel={`${name}: ${formatHearts(hearts)} of ${max} hearts${active ? '. Their turn' : ''}`}
    >
      <View style={[styles.hearts, glowBox]}>
        <HeartRow hearts={hearts} max={max} size={18} gap={3} />
        <View style={styles.divider} />
        <Text style={styles.count}>
          {formatHearts(hearts)}
        </Text>
      </View>
      <View style={[styles.name, active && [styles.nameActive, glowBox]]}>
        <Text style={[styles.nameText, active && { color: a.text, textShadowColor: a.textGlow, textShadowRadius: 8 }]}>{name}</Text>
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
    borderColor: 'transparent',
    backgroundColor: 'rgba(13,13,13,0.85)',
  },
  idle: { borderColor: 'transparent' },
  divider: { width: 1, height: 16, backgroundColor: colors.border },
  count: { fontFamily: fonts.bold, fontSize: 14, color: colors.white },
  name: {
    paddingHorizontal: 12,
    paddingVertical: 2,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: 'transparent',
    backgroundColor: 'rgba(13,13,13,0.8)',
  },
  nameActive: { paddingHorizontal: 16, paddingVertical: 4, borderRadius: 10 },
  nameText: { fontFamily: fonts.bold, fontSize: 14, letterSpacing: 2, textTransform: 'uppercase', color: colors.white },
});

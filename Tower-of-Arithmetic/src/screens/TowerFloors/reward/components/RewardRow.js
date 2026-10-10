import { Pressable, StyleSheet, View } from 'react-native';
import Text from '../../../../components/AppText';
import Icon from '../../../../components/Icon';
import ItemIcon from '../../../../components/run/ItemIcon';
import { colors, fonts } from '../../../../theme/theme';

// One reward. Collected rewards get a tick; the spell reward is a button.
export default function RewardRow({ icon, potionColor, title, detail, done, highlight, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      accessibilityRole={onPress ? 'button' : undefined}
      accessibilityLabel={`${title}. ${detail}`}
      style={({ pressed }) => [styles.row, highlight && styles.highlight, pressed && styles.pressed]}
    >
      <ItemIcon kind={icon} size={28} potionColor={potionColor} />
      <View style={styles.text}>
        <Text style={styles.title}>{title}</Text>
        <Text style={[styles.detail, highlight && styles.detailHighlight]}>{detail}</Text>
      </View>
      {done && <Icon name="check" size={20} color={colors.gold} />}
      {onPress && <Icon name="chevronRight" size={20} color={colors.white} />}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    minHeight: 56,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.panel,
  },
  highlight: { borderWidth: 2, borderColor: colors.gold, backgroundColor: '#2A1F5C' },
  pressed: { opacity: 0.85 },
  text: { flex: 1, gap: 2 },
  title: { fontFamily: fonts.bold, fontSize: 16, color: colors.white },
  detail: { fontFamily: fonts.regular, fontSize: 12, color: colors.mute },
  detailHighlight: { color: colors.gold, fontFamily: fonts.semibold },
});

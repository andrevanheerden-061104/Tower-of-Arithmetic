import { StyleSheet, View } from 'react-native';
import Text from '../../../../components/AppText';
import Icon from '../../../../components/Icon';
import { colors, fonts } from '../../../../theme/theme';

// Floors cleared, problems solved and XP earned this run.
export default function RunSummaryTiles({ cleared, total, solved, xp }) {
  return (
    <View style={styles.row}>
      <Tile icon="flag" value={`${cleared} / ${total}`} label="Floors cleared" accent="#C9A8E8" />
      <Tile icon="check" value={String(solved)} label="Problems solved" accent={colors.gold} />
      <Tile icon="star" value={`+${xp}`} label="XP earned" accent="#FFB86B" />
    </View>
  );
}

function Tile({ icon, value, label, accent }) {
  return (
    <View style={[styles.tile, { borderColor: accent }]} accessible accessibilityLabel={`${label}: ${value}`}>
      <Icon name={icon} size={22} color={accent} />
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.bar, { backgroundColor: accent }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 10 },
  tile: {
    flex: 1,
    minHeight: 104,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingHorizontal: 4,
    paddingBottom: 8,
    borderRadius: 16,
    borderWidth: 1.5,
    backgroundColor: '#2A1F4A',
  },
  value: { fontFamily: fonts.bold, fontSize: 22, color: colors.white },
  label: { fontFamily: fonts.medium, fontSize: 12, color: colors.pink, textAlign: 'center' },
  bar: { position: 'absolute', bottom: 0, width: '60%', height: 3, borderRadius: 2 },
});

import { StyleSheet, View } from 'react-native';
import Text from '../../../../components/AppText';
import Icon from '../../../../components/Icon';
import { ROOMS } from '../../../../game/rooms';
import { colors, fonts } from '../../../../theme/theme';

// Key to the room icons (only the room types this version uses).
export default function MapLegend({ roomTypes }) {
  const types = [...roomTypes, 'boss'];
  return (
    <View style={styles.legend} accessibilityLabel={`Room types: ${types.map((t) => ROOMS[t].label).join(', ')}`}>
      {types.map((type) => (
        <View key={type} style={styles.item}>
          <Icon name={ROOMS[type].icon} size={16} color={type === 'boss' ? colors.pink : colors.white} strokeWidth={1.8} />
          <Text style={styles.label}>{ROOMS[type].label}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  legend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    rowGap: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.bg,
  },
  item: { width: '33.3%', flexDirection: 'row', alignItems: 'center', gap: 6 },
  label: { fontFamily: fonts.medium, fontSize: 12, color: colors.white },
});

import { StyleSheet, View } from 'react-native';
import Text from '../../../../components/AppText';
import Icon from '../../../../components/Icon';
import { ROOMS } from '../../../../game/rooms';
import { colors, fonts } from '../../../../theme/theme';

// The room the player has picked, shown above the Enter button.
export default function SelectedRoom({ room }) {
  const info = ROOMS[room.type];
  return (
    <View style={styles.bar} accessibilityLiveRegion="polite">
      <Icon name={info.icon} size={20} color={colors.gold} strokeWidth={1.8} />
      <View style={styles.text}>
        <Text style={styles.title}>
          Floor {room.floor} · {info.label}
          {room.type === 'combat' || room.type === 'puzzle' ? ' room' : ''}
        </Text>
        <Text style={styles.detail} numberOfLines={2}>
          {info.description}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.panel,
  },
  text: { flex: 1, gap: 2 },
  title: { fontFamily: fonts.bold, fontSize: 15, color: colors.white },
  detail: { fontFamily: fonts.regular, fontSize: 12, color: colors.mute },
});

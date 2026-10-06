import { StyleSheet, Text, View } from 'react-native';
import Svg, { Polygon } from 'react-native-svg';
import Icon from '../../../components/Icon';
import { colors, fonts } from '../../../theme/theme';

// One hexagon medal. Locked badges are grey with a padlock.
export default function Badge({ name, earned }) {
  return (
    <View style={styles.wrap} accessibilityLabel={earned ? `Badge earned: ${name}` : 'Locked badge'}>
      <View style={styles.medal}>
        <Svg width={64} height={64} viewBox="0 0 64 64" style={StyleSheet.absoluteFill}>
          <Polygon
            points="32,3 57,17.5 57,46.5 32,61 7,46.5 7,17.5"
            fill={earned ? colors.indigo : colors.panel}
            stroke={earned ? colors.gold : colors.border}
            strokeWidth={earned ? 2 : 1.5}
            strokeLinejoin="round"
          />
        </Svg>
        <Icon name={earned ? 'award' : 'lock'} size={26} color={earned ? colors.gold : colors.mute} strokeWidth={1.8} />
      </View>
      <Text style={[styles.name, !earned && styles.nameLocked]} numberOfLines={1}>
        {name}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, alignItems: 'center', gap: 4 },
  medal: { width: 64, height: 64, alignItems: 'center', justifyContent: 'center' },
  name: { fontFamily: fonts.medium, fontSize: 12, color: colors.white },
  nameLocked: { color: colors.mute },
});

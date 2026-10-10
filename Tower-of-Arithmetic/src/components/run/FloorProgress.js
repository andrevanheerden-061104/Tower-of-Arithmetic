import { StyleSheet, View } from 'react-native';
import Text from '../AppText';
import Icon from '../Icon';
import { colors, fonts } from '../../theme/theme';

// A row of segments, one per floor, showing how far up the tower the
// player got. outcome="cleared" ticks the current floor, "fell" crosses it.
export default function FloorProgress({ total, current, outcome = 'cleared', label }) {
  const fell = outcome === 'fell';
  return (
    <View style={styles.wrap} accessible accessibilityLabel={label ?? `Floor ${current} of ${total}`}>
      <View style={styles.bar}>
        {Array.from({ length: total }, (_, i) => {
          const floor = i + 1;
          const done = floor < current;
          const here = floor === current;
          return (
            <View
              key={floor}
              style={[
                styles.segment,
                done && styles.done,
                here && (fell ? styles.fell : styles.here),
                here && styles.hereSize,
              ]}
            >
              {here && <Icon name={fell ? 'x' : 'check'} size={14} color={colors.bg} strokeWidth={3} />}
            </View>
          );
        })}
      </View>
      <View style={styles.labels}>
        <Text style={styles.end}>Floor 1</Text>
        <Text style={[styles.middle, fell && styles.middleFell]}>{label ?? `Floor ${current} of ${total}`}</Text>
        <Text style={styles.end}>Boss</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 8, alignSelf: 'stretch' },
  bar: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  segment: {
    flex: 1,
    height: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  done: { backgroundColor: '#C9A8E8', borderColor: '#C9A8E8' },
  here: { backgroundColor: colors.gold, borderColor: colors.gold },
  fell: { backgroundColor: '#FF9B8F', borderColor: '#FF9B8F' },
  hereSize: { height: 22, borderRadius: 6 },
  labels: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  end: { fontFamily: fonts.medium, fontSize: 12, color: colors.mute },
  middle: { fontFamily: fonts.semibold, fontSize: 13, color: colors.gold },
  middleFell: { color: '#FF9B8F' },
});

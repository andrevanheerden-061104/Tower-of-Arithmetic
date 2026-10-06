import { Pressable, StyleSheet, View } from 'react-native';
import Text from '../../../components/AppText';
import Icon from '../../../components/Icon';
import { colors, fonts } from '../../../theme/theme';

// Shows the saved run (floor and hearts left) and resumes it when tapped.
export default function ContinueRunCard({ run, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Continue run. Floor ${run.floor} of ${run.totalFloors}, ${run.hearts} of ${run.maxHearts} hearts left`}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <View style={styles.play}>
        <Icon name="play" size={18} />
      </View>

      <View style={styles.text}>
        <Text style={styles.title}>Continue run</Text>
        <Text style={styles.detail}>
          Floor {run.floor} of {run.totalFloors} · saved
        </Text>
      </View>

      <View style={styles.hearts}>
        {Array.from({ length: run.maxHearts }, (_, i) => (
          <Icon key={i} name="heart" size={16} color={colors.pink} fill={i < run.hearts ? colors.pink : 'none'} />
        ))}
      </View>

      <Icon name="chevronRight" size={18} color={colors.mute} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    height: 72,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.panel,
  },
  pressed: { opacity: 0.8 },
  play: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.indigo,
  },
  text: { flex: 1, gap: 4 },
  title: { fontFamily: fonts.semibold, fontSize: 16, color: colors.white },
  detail: { fontFamily: fonts.regular, fontSize: 12, color: colors.mute },
  hearts: { flexDirection: 'row', gap: 3 },
});

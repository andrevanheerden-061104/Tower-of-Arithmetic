import { StyleSheet, Text, View } from 'react-native';
import { colors, fonts } from '../../../theme/theme';

// "HIGHEST FLOOR 7 · RUNS COMPLETED 12" line above the menu.
export default function RunStats({ highestFloor, runsCompleted }) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>
        HIGHEST FLOOR <Text style={styles.value}>{highestFloor}</Text>
      </Text>
      <View style={styles.dot} />
      <Text style={styles.label}>
        RUNS COMPLETED <Text style={styles.value}>{runsCompleted}</Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12 },
  label: { fontFamily: fonts.semibold, fontSize: 12, letterSpacing: 1.1, color: colors.mute },
  value: { color: colors.gold },
  dot: { width: 3, height: 3, borderRadius: 2, backgroundColor: colors.mute },
});

import { StyleSheet, Text, View } from 'react-native';
import GradeChip from './GradeChip';
import { colors, fonts } from '../../../theme/theme';

const COLUMNS = 3;

// One CAPS phase: a small heading and its row of grade chips.
export default function GradeGroup({ name, grades, selected, onSelect }) {
  // Pad short rows (FET has two grades) so the chips keep the same width.
  const blanks = Array.from({ length: COLUMNS - grades.length });

  return (
    <View style={styles.wrap}>
      <Text style={styles.name}>{name}</Text>
      <View style={styles.row}>
        {grades.map((grade) => (
          <GradeChip key={grade} grade={grade} selected={selected === grade} onPress={() => onSelect(grade)} />
        ))}
        {blanks.map((_, i) => (
          <View key={`blank-${i}`} style={styles.blank} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 8 },
  name: {
    fontFamily: fonts.semibold,
    fontSize: 12,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    color: colors.mute,
  },
  row: { flexDirection: 'row', gap: 13 },
  blank: { flex: 1 },
});

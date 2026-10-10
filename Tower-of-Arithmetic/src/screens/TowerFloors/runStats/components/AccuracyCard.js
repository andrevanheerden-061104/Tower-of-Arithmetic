import { StyleSheet, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import Text from '../../../../components/AppText';
import { colors, fonts } from '../../../../theme/theme';

const SIZE = 104;
const STROKE = 10;
const R = (SIZE - STROKE) / 2;
const C = 2 * Math.PI * R;

// Accuracy ring plus the run's main numbers.
export default function AccuracyCard({ accuracy, solved, hints, errors, bestStreak }) {
  const rows = [
    ['Problems solved', solved],
    ['Hints used', hints],
    ['Errors', errors],
    ['Best streak', bestStreak],
  ];
  return (
    <View style={styles.card}>
      <View style={styles.ring} accessible accessibilityLabel={`${accuracy} percent accuracy`}>
        <Svg width={SIZE} height={SIZE}>
          <Circle cx={SIZE / 2} cy={SIZE / 2} r={R} stroke={colors.line} strokeWidth={STROKE} fill="none" />
          <Circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={R}
            stroke={colors.gold}
            strokeWidth={STROKE}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={`${(C * accuracy) / 100} ${C}`}
            transform={`rotate(-90 ${SIZE / 2} ${SIZE / 2})`}
          />
        </Svg>
        <View style={styles.ringText}>
          <Text style={styles.percent}>{accuracy}%</Text>
          <Text style={styles.ringLabel}>accuracy</Text>
        </View>
      </View>
      <View style={styles.list}>
        {rows.map(([label, value]) => (
          <View key={label} style={styles.row} accessible accessibilityLabel={`${label}: ${value}`}>
            <Text style={styles.label}>{label}</Text>
            <Text style={styles.value}>{value}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 18,
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: '#2A1F4A',
  },
  ring: { width: SIZE, height: SIZE },
  ringText: { ...StyleSheet.absoluteFillObject, alignItems: 'center', justifyContent: 'center' },
  percent: { fontFamily: fonts.bold, fontSize: 24, color: colors.white },
  ringLabel: { fontFamily: fonts.medium, fontSize: 12, color: colors.white },
  list: { flex: 1, gap: 8 },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  label: { fontFamily: fonts.medium, fontSize: 14, color: colors.white },
  value: { fontFamily: fonts.bold, fontSize: 16, color: colors.gold },
});

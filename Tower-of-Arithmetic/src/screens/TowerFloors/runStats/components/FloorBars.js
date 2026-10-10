import { StyleSheet, View } from 'react-native';
import Text from '../../../../components/AppText';
import { colors, fonts } from '../../../../theme/theme';

// One bar per floor: how many answers on that floor were right.
// Floors under 60% are shown in red so they stand out.
export default function FloorBars({ floors }) {
  const list = [...floors].sort((a, b) => a.floor - b.floor).slice(-7);
  return (
    <View style={styles.card}>
      <Text style={styles.heading}>ACCURACY BY FLOOR</Text>
      {list.length === 0 ? (
        <Text style={styles.empty}>No answers yet this run.</Text>
      ) : (
        <View style={styles.bars}>
          {list.map((f) => {
            const pct = Math.round((f.correct / f.total) * 100);
            const low = pct < 60;
            return (
              <View key={f.floor} style={styles.col} accessible accessibilityLabel={`Floor ${f.floor}: ${pct} percent`}>
                <Text style={[styles.pct, low && styles.low]}>{pct}%</Text>
                <View style={styles.track}>
                  <View style={[styles.fill, { height: `${Math.max(pct, 8)}%` }, low && styles.fillLow]} />
                </View>
                <Text style={styles.floor}>F{f.floor}</Text>
              </View>
            );
          })}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { padding: 16, gap: 12, borderRadius: 20, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.panel },
  heading: { fontFamily: fonts.semibold, fontSize: 12, letterSpacing: 1.2, color: colors.mute },
  empty: { fontFamily: fonts.regular, fontSize: 14, color: colors.mute },
  bars: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'flex-end' },
  col: { alignItems: 'center', gap: 6 },
  pct: { fontFamily: fonts.bold, fontSize: 12, color: colors.white },
  low: { color: '#FF9B8F' },
  track: { width: 30, height: 70, justifyContent: 'flex-end' },
  fill: { width: '100%', borderRadius: 6, backgroundColor: colors.gold },
  fillLow: { backgroundColor: '#FF9B8F' },
  floor: { fontFamily: fonts.medium, fontSize: 12, color: colors.mute },
});

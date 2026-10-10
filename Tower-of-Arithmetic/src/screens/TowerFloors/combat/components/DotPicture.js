import { StyleSheet, View } from 'react-native';
import { colors } from '../../../../theme/theme';

const DOT_COLORS = { gold: colors.gold, pink: '#F2A7B5' };

// Junior picture help: dots to count.
//   dots      groups of coloured dots (7 yellow + 5 pink)
//   takeAway  some dots crossed out (9 take away 3)
//   groups    equal groups in boxes (3 groups of 2)
export default function DotPicture({ picture }) {
  if (!picture) return null;

  if (picture.kind === 'groups') {
    return (
      <View style={styles.row}>
        {Array.from({ length: picture.groups }, (_, g) => (
          <View key={g} style={styles.group}>
            {Array.from({ length: picture.each }, (_, i) => (
              <View key={i} style={[styles.dot, { backgroundColor: colors.gold }]} />
            ))}
          </View>
        ))}
      </View>
    );
  }

  const dots =
    picture.kind === 'takeAway'
      ? Array.from({ length: picture.total }, (_, i) => ({ color: colors.gold, gone: i >= picture.total - picture.gone }))
      : picture.groups.flatMap((g) => Array.from({ length: g.count }, () => ({ color: DOT_COLORS[g.color] })));

  return (
    <View style={styles.wrap}>
      {dots.map((d, i) => (
        <View key={i} style={[styles.dot, { backgroundColor: d.color }, d.gone && styles.gone]}>
          {d.gone && <View style={styles.cross} />}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 6, maxWidth: 260, marginTop: 6 },
  row: { flexDirection: 'row', gap: 10, marginTop: 6 },
  group: {
    flexDirection: 'row',
    gap: 6,
    padding: 8,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  dot: { width: 30, height: 30, borderRadius: 15, borderWidth: 2, borderColor: colors.white, alignItems: 'center', justifyContent: 'center' },
  gone: { opacity: 0.45 },
  cross: { width: 30, height: 3, backgroundColor: '#FF9B8F', transform: [{ rotate: '45deg' }] },
});

import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Text from '../../AppText';
import { colors, fonts } from '../../../theme/theme';

const PAD = 16;

// A number line with jumps drawn as arcs over it ("2 equal jumps reach
// 14"). Each arc is labelled with its size, or "?" when that is the
// number to find.
export default function NumberLine({ model }) {
  const [width, setWidth] = useState(0);
  const { from, to, count, size, each, mark } = model;
  const span = Math.max(1, to - from);
  const x = (v) => PAD + ((v - from) / span) * (width - PAD * 2);

  // Ticks at every jump; a single short jump also gets a tick per number
  const jumps = Array.from({ length: count }, (_, i) => [from + i * size, from + (i + 1) * size]);
  const labelled = new Set([from, to, ...jumps.map(([a]) => a)]);
  if (mark != null) labelled.add(mark);
  const small = count === 1 && span <= 20 ? Array.from({ length: span + 1 }, (_, i) => from + i) : [];
  const arcHeight = Math.min(34, Math.max(16, (width / Math.max(count, 1)) * 0.35));

  return (
    <View
      style={styles.wrap}
      onLayout={(e) => setWidth(e.nativeEvent.layout.width)}
      accessible
      accessibilityLabel={`Number line from ${from} to ${to} with ${count} jump${count > 1 ? 's' : ''} of ${each === '?' ? 'an unknown size' : each}`}
    >
      {width > 0 && (
        <>
          {jumps.map(([a, b], i) => {
            const left = x(a);
            const w = x(b) - left;
            return (
              <View key={`arc${i}`} style={[styles.arcBox, { left, width: w, top: 22, height: arcHeight }]}>
                <View style={[styles.arc, { borderTopLeftRadius: w / 2, borderTopRightRadius: w / 2 }]} />
                <Text style={[styles.arcLabel, { top: -22 }]} maxScale={1.1}>
                  {each}
                </Text>
              </View>
            );
          })}
          <View style={[styles.line, { top: 22 + arcHeight, left: PAD - 6, width: width - PAD * 2 + 12 }]} />
          {small.map((v) => (
            <View key={`s${v}`} style={[styles.smallTick, { left: x(v) - 1, top: 22 + arcHeight - 4 }]} />
          ))}
          {[...labelled].map((v) => (
            <View key={`t${v}`} style={[styles.tickBox, { left: x(v) - 20, top: 22 + arcHeight - 7 }]}>
              <View style={[styles.tick, v === mark && styles.markTick]} />
              <Text style={[styles.tickLabel, v === mark && styles.markLabel]} maxScale={1.1}>
                {String(v).replace('-', '−')}
              </Text>
            </View>
          ))}
        </>
      )}
      <View style={{ height: 22 + arcHeight + 34 }} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { width: '100%' },
  arcBox: { position: 'absolute', alignItems: 'center' },
  arc: {
    position: 'absolute',
    top: 0,
    left: 2,
    right: 2,
    bottom: 0,
    borderWidth: 2,
    borderBottomWidth: 0,
    borderColor: colors.gold,
  },
  arcLabel: { position: 'absolute', fontFamily: fonts.bold, fontSize: 16, color: colors.gold },
  line: { position: 'absolute', height: 2, backgroundColor: colors.white },
  smallTick: { position: 'absolute', width: 2, height: 8, backgroundColor: colors.border },
  tickBox: { position: 'absolute', width: 40, alignItems: 'center' },
  tick: { width: 2, height: 14, backgroundColor: colors.white },
  markTick: { backgroundColor: colors.gold, width: 3 },
  tickLabel: { marginTop: 4, fontFamily: fonts.bold, fontSize: 14, color: colors.white },
  markLabel: { color: colors.gold },
});

import { useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import Text from '../AppText';
import Icon from '../Icon';
import { useDyscalculia } from '../../context/DyscalculiaContext';
import { colors, fonts } from '../../theme/theme';

const SYMBOLS = ['+', '−', '×', '÷', '=', '(', ')', '[', ']', 'x', 'n', 'y', '/', '.', '^', '√', '²', '³', 'π', '%', '<', '>', '≤', '≥', '°', '±', '∴', ':', ','];
const NAMES = {
  '⌫': 'Delete',
  next: 'Next step',
  ok: 'OK',
  '+': 'plus',
  '−': 'minus',
  '×': 'times',
  '÷': 'divided by',
  '=': 'equals',
  '(': 'open bracket',
  ')': 'close bracket',
  '[': 'open square bracket',
  ']': 'close square bracket',
  '/': 'over',
  '.': 'decimal point',
  ',': 'comma',
  '^': 'to the power of',
  '√': 'square root',
  '²': 'squared',
  '³': 'cubed',
  π: 'pi',
  '%': 'percent',
  '<': 'less than',
  '>': 'greater than',
  '≤': 'less than or equal to',
  '≥': 'greater than or equal to',
  '°': 'degrees',
  '±': 'plus or minus',
  '∴': 'therefore',
  ':': 'ratio',
};

function Keys({ keys, columns, onKey, keyHeight, even }) {
  const big = useDyscalculia();
  const rows = [];
  for (let i = 0; i < keys.length; i += columns) rows.push(keys.slice(i, i + columns));
  return (
    <View style={styles.pad}>
      {rows.map((row, r) => (
        <View key={r} style={styles.row}>
          {row.map((key) => {
            const action = key === 'next' || key === 'ok';
            return (
              <Pressable
                key={key}
                onPress={() => onKey(key)}
                accessibilityRole="button"
                accessibilityLabel={NAMES[key] ?? key}
                style={({ pressed }) => [styles.key, { height: keyHeight }, action && styles.action, pressed && styles.pressed]}
              >
                {key === '⌫' ? (
                  <Icon name="backspace" size={22} />
                ) : (
                  <Text style={[styles.label, big && styles.bigLabel, SYMBOLS.includes(key) && styles.symbol, action && styles.actionLabel]}>
                    {key === 'next' ? 'Next' : key === 'ok' ? 'OK' : key}
                  </Text>
                )}
              </Pressable>
            );
          })}
          {/* keep the last row's keys the same width as the rest */}
          {even && row.length < columns && Array.from({ length: columns - row.length }, (_, i) => <View key={`gap${i}`} style={styles.gap} />)}
        </View>
      ))}
    </View>
  );
}

// The on-screen keypad. Pass the keys in reading order and how many columns
// to use. Special keys: "⌫" deletes, "next" starts a new step, "ok" submits.
//
// When there are more maths keys than fit, pass `pages` (a list of key
// lists) instead of `keys`: the player swipes left and right between them,
// like a phone keyboard, or taps the "123" / "√ π %" buttons underneath.
export default function NumberPad({ keys, pages, pageNames = ['123', '√ π %'], columns = 3, onKey, keyHeight = 48 }) {
  const all = pages ?? [keys];
  const [width, setWidth] = useState(0);
  const [page, setPage] = useState(0);
  const scroll = useRef(null);

  if (all.length === 1) return <Keys keys={all[0]} columns={columns} onKey={onKey} keyHeight={keyHeight} />;

  const goTo = (i) => {
    setPage(i);
    scroll.current?.scrollTo({ x: i * width, animated: true });
  };
  const onScrollEnd = (e) => {
    if (!width) return;
    setPage(Math.max(0, Math.min(all.length - 1, Math.round(e.nativeEvent.contentOffset.x / width))));
  };

  return (
    <View style={styles.pages} onLayout={(e) => setWidth(e.nativeEvent.layout.width)}>
      {width ? (
        <ScrollView
          ref={scroll}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={onScrollEnd}
          onScrollEndDrag={onScrollEnd}
          scrollEventThrottle={32}
          onScroll={onScrollEnd}
          keyboardShouldPersistTaps="handled"
          style={styles.scroller}
        >
          {all.map((pageKeys, i) => (
            <View key={i} style={{ width }} accessibilityElementsHidden={i !== page} importantForAccessibility={i === page ? 'auto' : 'no-hide-descendants'}>
              <Keys keys={pageKeys} columns={columns} onKey={onKey} keyHeight={keyHeight} even />
            </View>
          ))}
        </ScrollView>
      ) : (
        <Keys keys={all[0]} columns={columns} onKey={onKey} keyHeight={keyHeight} even />
      )}
      <View style={styles.switcher} accessibilityRole="tablist">
        {all.map((_, i) => (
          <Pressable
            key={i}
            onPress={() => goTo(i)}
            hitSlop={6}
            accessibilityRole="tab"
            accessibilityState={{ selected: i === page }}
            accessibilityLabel={i === 0 ? 'Number keys' : 'More maths keys'}
            style={[styles.pageTab, i === page && styles.pageTabOn]}
          >
            <Text style={[styles.pageName, i === page && styles.pageNameOn]}>{pageNames[i] ?? `${i + 1}`}</Text>
          </Pressable>
        ))}
        <Text style={styles.swipe} accessibilityElementsHidden importantForAccessibility="no">
          {page === 0 ? 'swipe for more ›' : '‹ swipe back'}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  pages: { gap: 8 },
  scroller: { flexGrow: 0 },
  pad: { gap: 8 },
  row: { flexDirection: 'row', gap: 8 },
  key: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: '#2A2340',
  },
  gap: { flex: 1 },
  action: { backgroundColor: colors.indigo, borderColor: '#8C82A3' },
  pressed: { opacity: 0.7 },
  label: { fontFamily: fonts.bold, fontSize: 20, color: colors.white },
  bigLabel: { fontSize: 24 },
  symbol: { color: colors.gold },
  actionLabel: { fontSize: 15 },
  switcher: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  // Big enough to tap easily (at least 44 high, like every other button)
  pageTab: {
    minWidth: 92,
    height: 44,
    paddingHorizontal: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.line,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pageTabOn: { backgroundColor: colors.indigo, borderColor: colors.gold },
  pageName: { fontFamily: fonts.bold, fontSize: 16, color: colors.mute },
  pageNameOn: { color: colors.white },
  swipe: { flex: 1, textAlign: 'right', fontFamily: fonts.medium, fontSize: 12, color: colors.mute },
});

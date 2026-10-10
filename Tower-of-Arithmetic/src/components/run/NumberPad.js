import { Pressable, StyleSheet, View } from 'react-native';
import Text from '../AppText';
import Icon from '../Icon';
import { colors, fonts } from '../../theme/theme';

const SYMBOLS = ['+', '−', '×', '÷', '=', '(', ')', 'x', '/', '.'];
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
  '/': 'over',
};

// The on-screen keypad. Pass the keys in reading order and how many columns
// to use. Special keys: "⌫" deletes, "next" starts a new step, "ok" submits.
export default function NumberPad({ keys, columns = 3, onKey, keyHeight = 48 }) {
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
                  <Text style={[styles.label, SYMBOLS.includes(key) && styles.symbol, action && styles.actionLabel]}>
                    {key === 'next' ? 'Next' : key === 'ok' ? 'OK' : key}
                  </Text>
                )}
              </Pressable>
            );
          })}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
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
  action: { backgroundColor: colors.indigo, borderColor: '#8C82A3' },
  pressed: { opacity: 0.7 },
  label: { fontFamily: fonts.bold, fontSize: 20, color: colors.white },
  symbol: { color: colors.gold },
  actionLabel: { fontSize: 15 },
});

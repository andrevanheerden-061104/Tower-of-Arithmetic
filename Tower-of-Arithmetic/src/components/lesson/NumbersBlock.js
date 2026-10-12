import { StyleSheet, View } from 'react-native';
import Text from '../AppText';
import { colors, fonts } from '../../theme/theme';

// A row of numbers in chips, with the jump between them written above
// (+4, ×3, −7). A "?" chip is the number to find.
export default function NumbersBlock({ values, between = [], caption }) {
  const spoken = values.map((v) => (v === '?' ? 'what comes next' : String(v).replace('-', 'minus '))).join(', ');
  return (
    <View style={styles.wrap} accessible accessibilityLabel={`${spoken}${caption ? `. ${caption}` : ''}`}>
      <View style={styles.row}>
        {values.map((value, i) => (
          <View key={i} style={styles.cell}>
            <View style={[styles.chip, value === '?' && styles.mystery]}>
              <Text style={[styles.value, value === '?' && styles.mysteryText]} adjustsFontSizeToFit numberOfLines={1}>
                {String(value).replace('-', '−')}
              </Text>
            </View>
            {i < values.length - 1 && between[i] ? <Text style={styles.jump}>{between[i]}</Text> : null}
          </View>
        ))}
      </View>
      {caption ? <Text style={styles.caption}>{caption}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 10, padding: 16, borderRadius: 18, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.panel },
  row: { flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap', rowGap: 10 },
  cell: { flexDirection: 'row', alignItems: 'center' },
  chip: {
    minWidth: 40,
    height: 44,
    paddingHorizontal: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mystery: { borderColor: colors.gold, borderStyle: 'dashed', borderWidth: 2 },
  value: { fontFamily: fonts.bold, fontSize: 18, color: colors.white },
  mysteryText: { color: colors.gold },
  jump: { marginHorizontal: 3, fontFamily: fonts.bold, fontSize: 11, color: colors.gold },
  caption: { fontFamily: fonts.medium, fontSize: 13, lineHeight: 19, color: colors.mute, textAlign: 'center' },
});

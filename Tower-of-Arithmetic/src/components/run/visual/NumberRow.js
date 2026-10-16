import { StyleSheet, View } from 'react-native';
import Text from '../../AppText';
import { colors, fonts } from '../../../theme/theme';

// Numbers in chips, with the jump between them written in between
// (+6, −9). A "?" chip is the number to find; highlighted chips (the
// middle for a median, the ends for a range) get a gold border.
export default function NumberRow({ model }) {
  const { values, between = [], highlight = [] } = model;
  return (
    <View style={styles.row} accessible accessibilityLabel={values.join(', ')}>
      {values.map((value, i) => (
        <View key={i} style={styles.cell}>
          <View style={[styles.chip, value === '?' && styles.mystery, highlight.includes(i) && styles.picked]}>
            <Text style={[styles.value, (value === '?' || highlight.includes(i)) && styles.gold]} numberOfLines={1} adjustsFontSizeToFit maxScale={1.1}>
              {value}
            </Text>
          </View>
          {i < values.length - 1 && between[i] ? <Text style={styles.jump} maxScale={1.1}>{between[i]}</Text> : null}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap', rowGap: 10, columnGap: 4 },
  cell: { flexDirection: 'row', alignItems: 'center' },
  chip: {
    minWidth: 42,
    height: 46,
    paddingHorizontal: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mystery: { borderColor: colors.gold, borderStyle: 'dashed', borderWidth: 2 },
  picked: { borderColor: colors.gold, borderWidth: 2 },
  value: { fontFamily: fonts.bold, fontSize: 19, color: colors.white },
  gold: { color: colors.gold },
  jump: { marginHorizontal: 3, fontFamily: fonts.bold, fontSize: 12, color: colors.gold },
});

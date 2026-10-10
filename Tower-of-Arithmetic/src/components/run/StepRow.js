import { Pressable, StyleSheet } from 'react-native';
import Text from '../AppText';
import Icon from '../Icon';
import { colors, fonts } from '../../theme/theme';

// One line of working ("Step 2   2x = 14"). status: 'done' shows a tick,
// 'active' is the line being typed (gold border, cursor), 'wrong' is red.
export default function StepRow({ number, value, status = 'done', unit, onPress }) {
  const active = status === 'active';
  const wrong = status === 'wrong';
  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      accessibilityLabel={`Step ${number}: ${value || 'empty'}`}
      style={[styles.row, active && styles.active, wrong && styles.wrong]}
    >
      <Text style={styles.label}>Step {number}</Text>
      <Text style={[styles.value, active && styles.activeValue]}>
        {value}
        {active ? '|' : ''}
      </Text>
      {unit ? <Text style={styles.unit}>{unit}</Text> : null}
      {status === 'done' && <Icon name="check" size={18} color={colors.gold} />}
      {wrong && <Icon name="x" size={18} color="#FF9B8F" />}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.bg,
  },
  active: { borderWidth: 2, borderColor: colors.gold },
  wrong: { borderWidth: 2, borderColor: '#FF9B8F' },
  label: { fontFamily: fonts.medium, fontSize: 12, color: colors.mute },
  value: { flex: 1, fontFamily: fonts.bold, fontSize: 17, color: colors.white },
  activeValue: { color: colors.gold },
  unit: { fontFamily: fonts.bold, fontSize: 15, color: colors.white },
});

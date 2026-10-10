import { Pressable, StyleSheet } from 'react-native';
import Text from '../../../../components/AppText';
import Icon from '../../../../components/Icon';
import { colors, fonts } from '../../../../theme/theme';

// One line of the proof: the statement and the reason the player chose.
// Tap a row to pick it, then tap a reason chip below.
export default function ProofRow({ statement, reason, active, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      accessibilityLabel={`${statement}. Reason: ${reason ?? 'not chosen yet'}`}
      style={[styles.row, active && styles.active]}
    >
      <Text style={styles.statement}>{statement}</Text>
      <Text style={[styles.reason, !reason && styles.empty]}>{reason ?? 'Choose a reason'}</Text>
      {reason && !active ? <Icon name="check" size={18} color={colors.gold} /> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.bg,
  },
  active: { borderWidth: 2, borderColor: colors.gold },
  statement: { width: '48%', fontFamily: fonts.bold, fontSize: 13, color: colors.white },
  reason: { flex: 1, fontFamily: fonts.medium, fontSize: 13, color: colors.pink },
  empty: { color: colors.gold },
});

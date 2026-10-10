import { Pressable, StyleSheet, View } from 'react-native';
import Text from '../AppText';
import Icon from '../Icon';
import { colors, fonts } from '../../theme/theme';

// A choice card with an icon, a title, a line of detail, an optional note
// (e.g. a drawback in red) and a round tick on the right when chosen.
// Used by the ghost event, the rest site and remove a curse.
export default function ChoiceOption({ icon, title, detail, note, noteColor = colors.mute, selected, disabled, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="radio"
      accessibilityState={{ checked: selected, disabled }}
      accessibilityLabel={[title, detail, note].filter(Boolean).join('. ')}
      style={({ pressed }) => [styles.card, selected && styles.selected, disabled && styles.disabled, pressed && styles.pressed]}
    >
      <View style={styles.icon}>{icon}</View>
      <View style={styles.text}>
        <Text style={styles.title}>{title}</Text>
        {detail ? <Text style={styles.detail}>{detail}</Text> : null}
        {note ? <Text style={[styles.note, { color: noteColor }]}>{note}</Text> : null}
      </View>
      <View style={[styles.radio, selected && styles.radioOn]}>
        {selected && <Icon name="check" size={14} color={colors.bg} strokeWidth={3} />}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.panel,
  },
  selected: { borderWidth: 2, borderColor: colors.gold, backgroundColor: '#2A1F5C' },
  disabled: { opacity: 0.45 },
  pressed: { opacity: 0.85 },
  icon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.bg,
  },
  text: { flex: 1, gap: 3 },
  title: { fontFamily: fonts.bold, fontSize: 15, color: colors.white },
  detail: { fontFamily: fonts.medium, fontSize: 13, lineHeight: 18, color: colors.white },
  note: { fontFamily: fonts.semibold, fontSize: 13, lineHeight: 18 },
  radio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioOn: { backgroundColor: colors.gold, borderColor: colors.gold },
});

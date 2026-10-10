import { Pressable, StyleSheet, View } from 'react-native';
import Text from '../../../../components/AppText';
import Icon from '../../../../components/Icon';
import { colors, fonts } from '../../../../theme/theme';

const MODES = [
  { id: 'keypad', label: 'Keypad', icon: 'keyboard' },
  { id: 'speak', label: 'Speak', icon: 'mic' },
  { id: 'draw', label: 'Draw', icon: 'pencil' },
];

// Keypad / Speak / Draw switch for senior answers.
export default function AnswerModeTabs({ mode, onChange }) {
  return (
    <View style={styles.tabs} accessibilityRole="tablist">
      {MODES.map((m) => {
        const on = m.id === mode;
        return (
          <Pressable
            key={m.id}
            onPress={() => onChange(m.id)}
            accessibilityRole="tab"
            accessibilityState={{ selected: on }}
            accessibilityLabel={m.label}
            style={[styles.tab, on && styles.on]}
          >
            <Icon name={m.icon} size={18} color={on ? colors.white : colors.mute} />
            <Text style={[styles.label, on && styles.labelOn]}>{m.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  tabs: {
    flexDirection: 'row',
    padding: 4,
    gap: 4,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.bg,
  },
  tab: {
    flex: 1,
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: 12,
  },
  on: { backgroundColor: colors.indigo, borderWidth: 1, borderColor: colors.gold },
  label: { fontFamily: fonts.semibold, fontSize: 14, color: colors.mute },
  labelOn: { color: colors.white },
});

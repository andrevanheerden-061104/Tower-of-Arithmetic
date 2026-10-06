import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, fonts } from '../../theme/theme';

const TABS = [
  { key: 'signup', label: 'Create account' },
  { key: 'login', label: 'Log in' },
];

// Switch between the Create account and Log in screens.
export default function AuthTabs({ active, onChange }) {
  return (
    <View style={styles.wrap} accessibilityRole="tablist">
      {TABS.map((tab) => {
        const selected = tab.key === active;
        return (
          <Pressable
            key={tab.key}
            onPress={() => onChange(tab.key)}
            accessibilityRole="tab"
            accessibilityState={{ selected }}
            style={[styles.tab, selected && styles.tabSelected]}
          >
            <Text style={[styles.label, selected && styles.labelSelected]}>{tab.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    gap: 4,
    padding: 4,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.panel,
  },
  tab: {
    flex: 1,
    minHeight: 44,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabSelected: { backgroundColor: colors.indigo },
  label: { fontFamily: fonts.medium, fontSize: 14, color: colors.mute },
  labelSelected: { fontFamily: fonts.semibold, color: colors.white },
});

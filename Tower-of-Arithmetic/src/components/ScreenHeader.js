import { Pressable, StyleSheet, Text, View } from 'react-native';
import Icon from './Icon';
import { colors, fonts } from '../theme/theme';

// Back button and screen title, used at the top of the menu screens.
export default function ScreenHeader({ title, onBack }) {
  return (
    <View style={styles.wrap}>
      <Pressable
        onPress={onBack}
        accessibilityRole="button"
        accessibilityLabel="Go back"
        style={({ pressed }) => [styles.back, pressed && styles.pressed]}
      >
        <Icon name="arrowLeft" size={22} />
      </Pressable>

      <Text style={styles.title} accessibilityRole="header">
        {title}
      </Text>

      {/* Empty box the same size as the back button keeps the title centred */}
      <View style={styles.spacer} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  back: {
    width: 44,
    height: 44,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.panel,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: { opacity: 0.8 },
  title: { fontFamily: fonts.semibold, fontSize: 16, color: colors.white },
  spacer: { width: 44, height: 44 },
});

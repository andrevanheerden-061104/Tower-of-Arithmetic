import { KeyboardAvoidingView, ScrollView, StyleSheet, View } from 'react-native';
import Shade from '../Shade';
import ScreenBackground from '../ScreenBackground';
import { colors, spacing } from '../../theme/theme';

// The shared frame for both auth screens: dimmed tower artwork behind,
// and a scroll area that moves out of the keyboard's way.
export default function AuthLayout({ children }) {
  return (
    <View style={styles.screen}>
      <ScreenBackground opacity={0.9} />
      <Shade stops={[[0, 0.86], [0.28, 0.78], [0.5, 0.97], [1, 1]]} />

      {/* Android draws edge-to-edge, so the window no longer shrinks for the
          keyboard by itself; pad on both platforms to lift the form above it */}
      <KeyboardAvoidingView style={styles.fill} behavior="padding">
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  fill: { flex: 1 },
  content: {
    flexGrow: 1,
    justifyContent: 'space-between',
    gap: 32,
    paddingTop: spacing.top + 8,
    paddingBottom: spacing.bottom,
    paddingHorizontal: spacing.gutter,
  },
});

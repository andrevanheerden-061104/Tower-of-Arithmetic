import { Pressable, StyleSheet, Text } from 'react-native';
import { colors, fonts } from '../../theme/theme';

// "Already an apprentice? Log in" style line under the main button.
export default function AuthSwitchLink({ question, action, onPress }) {
  return (
    <Pressable onPress={onPress} accessibilityRole="link" style={styles.wrap} hitSlop={8}>
      <Text style={styles.question}>
        {question} <Text style={styles.action}>{action}</Text>
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: { minHeight: 44, justifyContent: 'center', alignItems: 'center' },
  question: { fontFamily: fonts.regular, fontSize: 13, color: colors.mute },
  action: { fontFamily: fonts.semibold, color: colors.gold },
});

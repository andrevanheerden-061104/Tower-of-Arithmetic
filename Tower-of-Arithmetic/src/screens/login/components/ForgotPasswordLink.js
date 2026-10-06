import { Pressable, StyleSheet } from 'react-native';
import Text from '../../../components/AppText';
import { colors, fonts } from '../../../theme/theme';

// Does nothing yet: password reset needs the backend.
export default function ForgotPasswordLink({ onPress }) {
  return (
    <Pressable onPress={onPress} accessibilityRole="link" style={styles.wrap} hitSlop={8}>
      <Text style={styles.text}>Forgot password?</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: { alignSelf: 'flex-end', minHeight: 44, justifyContent: 'center' },
  text: { fontFamily: fonts.medium, fontSize: 13, color: colors.gold },
});

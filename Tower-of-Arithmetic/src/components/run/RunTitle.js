import { StyleSheet } from 'react-native';
import Text from '../AppText';
import { colors, fonts } from '../../theme/theme';

// Big screen title used on the tower screens ("Choose your path").
export default function RunTitle({ children, style }) {
  return (
    <Text style={[styles.title, style]} accessibilityRole="header">
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  title: {
    fontFamily: fonts.display,
    fontSize: 24,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    color: colors.white,
  },
});

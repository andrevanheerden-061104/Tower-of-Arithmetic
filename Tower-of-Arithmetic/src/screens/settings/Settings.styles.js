import { StyleSheet } from 'react-native';
import { colors, spacing } from '../../theme/theme';

export default StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  content: {
    gap: 20,
    paddingTop: spacing.top,
    paddingBottom: spacing.bottom,
    paddingHorizontal: spacing.gutter,
  },
});

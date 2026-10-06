import { StyleSheet } from 'react-native';
import { colors, spacing } from '../../theme/theme';

export default StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.bg,
    overflow: 'hidden',
  },
  content: {
    flex: 1,
    paddingTop: spacing.top,
    paddingBottom: 24,
    paddingHorizontal: spacing.gutter,
  },
  menu: {
    gap: 14,
    alignItems: 'stretch',
  },
});

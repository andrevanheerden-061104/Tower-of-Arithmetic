import { StyleSheet } from 'react-native';
import { colors, spacing } from '../../theme/theme';

export default StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  content: {
    flexGrow: 1,
    paddingTop: spacing.top,
  },
  top: {
    flex: 1,
    gap: 14,
    paddingHorizontal: spacing.gutter,
    paddingBottom: 16,
  },
  // Dark sheet at the bottom holding the spell and the confirm button
  panel: {
    gap: 16,
    paddingTop: 18,
    paddingBottom: 28,
    paddingHorizontal: spacing.gutter,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderWidth: 1,
    borderBottomWidth: 0,
    borderColor: colors.line,
    backgroundColor: colors.panel,
  },
});

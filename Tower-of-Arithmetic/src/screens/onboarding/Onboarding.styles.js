import { StyleSheet } from 'react-native';
import { colors, fonts, spacing } from '../../theme/theme';

export default StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  content: {
    flexGrow: 1,
    justifyContent: 'space-between',
    gap: 28,
    paddingTop: spacing.top + 8,
    paddingBottom: spacing.bottom,
    paddingHorizontal: spacing.gutter,
  },
  header: { gap: 28 },
  titleBlock: { gap: 8 },
  title: {
    fontFamily: fonts.display,
    fontSize: 26,
    color: colors.white,
  },
  subtitle: {
    fontFamily: fonts.regular,
    fontSize: 14,
    lineHeight: 20,
    color: colors.pink,
  },
  groups: { gap: 16 },
});

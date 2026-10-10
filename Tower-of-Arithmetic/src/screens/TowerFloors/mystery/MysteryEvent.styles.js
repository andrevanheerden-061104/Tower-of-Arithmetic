import { StyleSheet } from 'react-native';
import { colors, fonts, spacing } from '../../../theme/theme';

// Shared look for the event screens (ghost, campfire, remove a curse).
export default StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  content: {
    flexGrow: 1,
    gap: 12,
    paddingTop: spacing.top,
    paddingBottom: spacing.bottom,
    paddingHorizontal: spacing.gutter,
  },
  spacer: { flex: 1, minHeight: 210 },
  titles: { gap: 8 },
  body: { fontFamily: fonts.regular, fontSize: 15, lineHeight: 22, color: colors.pink },
});

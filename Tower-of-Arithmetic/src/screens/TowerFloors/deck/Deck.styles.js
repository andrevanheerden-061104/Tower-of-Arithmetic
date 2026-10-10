import { StyleSheet } from 'react-native';
import { colors, fonts, spacing } from '../../../theme/theme';

export default StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  content: {
    gap: 24,
    paddingTop: spacing.top,
    paddingBottom: 24,
    paddingHorizontal: spacing.gutter,
  },
  section: { gap: 8 },
  heading: { fontFamily: fonts.bold, fontSize: 16, color: colors.gold },
  detail: { fontFamily: fonts.medium, fontSize: 13, lineHeight: 19, color: colors.mute, marginBottom: 4 },
});

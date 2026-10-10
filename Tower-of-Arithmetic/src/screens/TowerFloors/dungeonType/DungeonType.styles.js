import { StyleSheet } from 'react-native';
import { colors, fonts, spacing } from '../../../theme/theme';

export default StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  content: {
    gap: 16,
    paddingTop: spacing.top,
    paddingBottom: 120,
    paddingHorizontal: spacing.gutter,
  },
  intro: { gap: 10, marginTop: 8, marginBottom: 16 },
  lead: { fontFamily: fonts.regular, fontSize: 15, lineHeight: 22, color: colors.pink },
  sectionLabel: {
    marginTop: 4,
    fontFamily: fonts.semibold,
    fontSize: 12,
    letterSpacing: 1.2,
    color: colors.mute,
  },
  footer: {
    position: 'absolute',
    left: spacing.gutter,
    right: spacing.gutter,
    bottom: spacing.bottom,
  },
});

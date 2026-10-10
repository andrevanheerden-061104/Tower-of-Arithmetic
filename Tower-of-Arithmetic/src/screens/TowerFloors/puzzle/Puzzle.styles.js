import { StyleSheet } from 'react-native';
import { colors, fonts, spacing } from '../../../theme/theme';

export default StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  content: {
    flexGrow: 1,
    gap: 14,
    paddingTop: spacing.top,
    paddingBottom: spacing.bottom,
    paddingHorizontal: spacing.gutter,
  },
  titleRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginTop: 6 },
  titleText: { flex: 1, gap: 6 },
  juniorQuestion: { fontFamily: fonts.bold, fontSize: 24, color: colors.gold },
  roundButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  speaker: { borderRadius: 22, backgroundColor: colors.gold, borderColor: colors.gold },
  question: { fontFamily: fonts.medium, fontSize: 15, lineHeight: 22, color: colors.white },
  wrong: { fontFamily: fonts.semibold, fontSize: 14, color: '#FF9B8F' },
});

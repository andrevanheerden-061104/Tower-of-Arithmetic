import { StyleSheet } from 'react-native';
import { colors, fonts, spacing } from '../../../theme/theme';

export default StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  content: {
    flex: 1,
    gap: 18,
    paddingTop: spacing.top,
    paddingBottom: spacing.bottom,
    paddingHorizontal: spacing.gutter,
  },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  title: { fontSize: 20 },
  box: {
    width: 50,
    height: 44,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.panel,
    alignItems: 'center',
    justifyContent: 'center',
  },
  count: { fontFamily: fonts.bold, fontSize: 14, color: colors.gold },
  footer: { marginTop: 'auto', gap: 6 },
  skip: { height: 44, alignItems: 'center', justifyContent: 'center' },
  skipText: { fontFamily: fonts.semibold, fontSize: 15, color: colors.gold },
});

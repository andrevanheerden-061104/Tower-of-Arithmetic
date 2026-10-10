import { StyleSheet } from 'react-native';
import { colors, fonts, spacing } from '../../../theme/theme';

export default StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  coins: {
    position: 'absolute',
    top: spacing.top,
    right: spacing.gutter,
    zIndex: 2,
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: 'rgba(23,20,31,0.92)',
  },
  coinsText: { fontFamily: fonts.bold, fontSize: 14, color: colors.gold },
  content: {
    flexGrow: 1,
    justifyContent: 'flex-end',
    gap: 14,
    paddingTop: 290,
    paddingBottom: spacing.bottom,
    paddingHorizontal: spacing.gutter,
  },
  titles: { alignItems: 'center', gap: 6 },
  title: {
    fontFamily: fonts.display,
    fontSize: 52,
    letterSpacing: 2,
    textTransform: 'uppercase',
    color: colors.gold,
    textShadowColor: 'rgba(0,0,0,0.6)',
    textShadowRadius: 8,
    textAlign: 'center',
  },
  subtitle: { fontFamily: fonts.bold, fontSize: 14, letterSpacing: 2, color: colors.white },
  list: { gap: 10 },
  summary: { fontFamily: fonts.medium, fontSize: 13, color: colors.mute, textAlign: 'center' },
});

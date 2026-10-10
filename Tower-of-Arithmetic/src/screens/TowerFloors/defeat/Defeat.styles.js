import { StyleSheet } from 'react-native';
import { colors, fonts, spacing } from '../../../theme/theme';

export default StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  content: {
    flexGrow: 1,
    justifyContent: 'flex-end',
    gap: 14,
    paddingTop: 280,
    paddingBottom: spacing.bottom,
    paddingHorizontal: spacing.gutter,
  },
  titles: { alignItems: 'center', gap: 6 },
  title: {
    fontFamily: fonts.display,
    fontSize: 48,
    letterSpacing: 2,
    textTransform: 'uppercase',
    color: colors.pink,
    textShadowColor: 'rgba(0,0,0,0.6)',
    textShadowRadius: 8,
  },
  subtitle: { fontFamily: fonts.bold, fontSize: 14, letterSpacing: 2, color: colors.white },
  body: { fontFamily: fonts.regular, fontSize: 15, lineHeight: 22, color: colors.pink, textAlign: 'center' },
  banner: {
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    backgroundColor: 'rgba(112,70,140,0.45)',
  },
  bannerText: { fontFamily: fonts.bold, fontSize: 15, color: colors.white },
  saved: { fontFamily: fonts.medium, fontSize: 13, color: colors.mute, textAlign: 'center' },
});

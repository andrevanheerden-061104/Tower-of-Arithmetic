import { StyleSheet } from 'react-native';
import { colors, fonts, spacing } from '../../../theme/theme';

export default StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  hero: { height: 350, overflow: 'hidden' },
  heroImage: { width: '100%', height: '100%' },
  hud: { position: 'absolute', top: spacing.top, left: spacing.gutter, right: spacing.gutter },
  panel: {
    gap: 12,
    paddingTop: 18,
    paddingBottom: spacing.bottom,
    paddingHorizontal: spacing.gutter,
  },
  subRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sub: { fontFamily: fonts.regular, fontSize: 14, color: colors.pink },
  tap: { fontFamily: fonts.regular, fontSize: 13, color: colors.mute },
  leave: { height: 44, alignItems: 'center', justifyContent: 'center' },
  leaveText: { fontFamily: fonts.semibold, fontSize: 15, color: colors.gold },
});

import { StyleSheet } from 'react-native';
import { colors, spacing } from '../../../theme/theme';

export default StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg, overflow: 'hidden' },
  // Top bar (menu, coins, floor) plus the boss title or the potion strip.
  // Above everything, including the cast sheet.
  top: {
    position: 'absolute',
    top: spacing.top,
    left: spacing.gutter,
    right: spacing.gutter,
    gap: 12,
    zIndex: 20,
    elevation: 20,
  },
  bottom: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    gap: 10,
  },
});

import { StyleSheet } from 'react-native';
import { colors, spacing } from '../../../theme/theme';

export default StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg, overflow: 'hidden' },
  top: {
    position: 'absolute',
    top: spacing.top,
    left: spacing.gutter,
    right: spacing.gutter,
    gap: 12,
    zIndex: 2,
  },
  bottom: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    gap: 10,
  },
});

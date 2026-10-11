import { StyleSheet } from 'react-native';
import { colors, spacing } from '../../theme/theme';

export default StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  // Above everything in the scene, including the cast sheet
  overlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 50, elevation: 50 },
  guide: { left: spacing.gutter, right: spacing.gutter },
});

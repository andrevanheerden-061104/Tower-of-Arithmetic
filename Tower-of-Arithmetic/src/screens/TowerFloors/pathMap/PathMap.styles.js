import { StyleSheet } from 'react-native';
import { colors, spacing } from '../../../theme/theme';

export default StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  content: {
    flex: 1,
    gap: 14,
    paddingTop: spacing.top,
    paddingBottom: 28,
    paddingHorizontal: spacing.gutter,
  },
  titleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  board: {
    flex: 1,
    padding: 12,
    gap: 12,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: '#1E1830',
  },
});

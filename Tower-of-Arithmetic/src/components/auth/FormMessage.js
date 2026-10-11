import { StyleSheet, View } from 'react-native';
import Text from '../AppText';
import { colors, fonts } from '../../theme/theme';

// A message under a login form: what went wrong (tone "error") or what to
// do next (tone "info"). Read out by screen readers as soon as it appears.
export default function FormMessage({ text, tone = 'error' }) {
  if (!text) return null;
  return (
    <View style={[styles.box, tone === 'info' && styles.info]} accessibilityLiveRegion="assertive" accessibilityRole="alert">
      <Text style={[styles.text, tone === 'info' && styles.infoText]}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FF9B8F',
    backgroundColor: 'rgba(255,155,143,0.1)',
  },
  info: { borderColor: colors.gold, backgroundColor: 'rgba(242,234,121,0.08)' },
  text: { fontFamily: fonts.semibold, fontSize: 14, lineHeight: 20, color: '#FFB4AB' },
  infoText: { color: colors.gold },
});

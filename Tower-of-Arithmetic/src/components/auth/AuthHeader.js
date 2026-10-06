import { Image, StyleSheet, Text, View } from 'react-native';
import { colors, fonts } from '../../theme/theme';

const logo = require('../../assets/logo/logoWhite.png');

// Logo, title and one line of help text at the top of both auth screens.
export default function AuthHeader({ title, subtitle }) {
  return (
    <View style={styles.wrap}>
      <Image source={logo} style={styles.logo} resizeMode="contain" accessibilityLabel="Tower of Arithmetic logo" />
      <Text style={styles.title} accessibilityRole="header">
        {title}
      </Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', gap: 10 },
  logo: { width: 64, height: 64 },
  title: {
    fontFamily: fonts.display,
    fontSize: 24,
    lineHeight: 30,
    color: colors.white,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: fonts.regular,
    fontSize: 14,
    lineHeight: 20,
    color: colors.pink,
    textAlign: 'center',
    maxWidth: 300,
  },
});

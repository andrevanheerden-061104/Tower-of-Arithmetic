import { Image, StyleSheet, Text, View } from 'react-native';
import { colors, fonts } from '../../../theme/theme';

const logo = require('../../../assets/logo/logoWhite.png');

// Logo, game title and tagline at the top of the splash screen.
export default function SplashBrand() {
  return (
    <View style={styles.wrap}>
      <Image source={logo} style={styles.logo} resizeMode="contain" accessibilityLabel="Tower of Arithmetic logo" />
      <Text style={styles.over}>TOWER OF</Text>
      <Text style={styles.title} accessibilityRole="header">
        ARITHMETIC
      </Text>
      <View style={styles.rule} />
      <Text style={styles.tagline}>Every spell is an equation.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', gap: 8 },
  logo: { width: 88, height: 88 },
  over: {
    fontFamily: fonts.regular,
    fontSize: 15,
    letterSpacing: 6,
    color: colors.pink,
  },
  title: {
    fontFamily: fonts.display,
    fontSize: 36,
    letterSpacing: 2,
    color: colors.white,
  },
  rule: { width: 180, height: 1, backgroundColor: colors.gold, opacity: 0.9 },
  tagline: { fontFamily: fonts.medium, fontSize: 14, color: colors.white },
});

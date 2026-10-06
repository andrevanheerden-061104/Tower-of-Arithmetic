import { Image, StyleSheet, View } from 'react-native';
import Svg, { Defs, RadialGradient, Rect, Stop } from 'react-native-svg';
import { colors } from '../../../theme/theme';

const character = require('../../../assets/charaters/sorceress1-F-front.png');

// The player's character in the middle of the home screen,
// standing in front of a soft violet glow.
export default function CharacterStage() {
  return (
    <View style={styles.wrap}>
      <Svg width="100%" height="100%" style={StyleSheet.absoluteFill} pointerEvents="none">
        <Defs>
          <RadialGradient id="characterGlow" cx="50%" cy="50%" r="50%">
            <Stop offset="0" stopColor={colors.violet} stopOpacity="0.75" />
            <Stop offset="1" stopColor={colors.violet} stopOpacity="0" />
          </RadialGradient>
        </Defs>
        <Rect x="0" y="0" width="100%" height="100%" fill="url(#characterGlow)" />
      </Svg>

      <Image
        source={character}
        style={styles.image}
        resizeMode="contain"
        accessibilityLabel="Your character, Shadow the sorceress"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    marginVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Slightly taller than its box so the sprite's empty margins are cropped
  image: { width: '125%', height: '118%' },
});

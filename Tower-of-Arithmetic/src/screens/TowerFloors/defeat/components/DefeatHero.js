import { Image, StyleSheet, View } from 'react-native';
import Svg, { Defs, RadialGradient, Rect, Stop } from 'react-native-svg';
import ScreenBackground from '../../../../components/ScreenBackground';
import Shade from '../../../../components/Shade';
import { colors } from '../../../../theme/theme';

// The character as a dark silhouette in a dim purple glow.
export default function DefeatHero({ character }) {
  return (
    <View style={styles.wrap} pointerEvents="none">
      <ScreenBackground opacity={0.2} />
      <Svg width="100%" height="100%" style={StyleSheet.absoluteFill}>
        <Defs>
          <RadialGradient id="defeatGlow" cx="50%" cy="45%" r="50%">
            <Stop offset="0" stopColor={colors.violet} stopOpacity="0.8" />
            <Stop offset="1" stopColor={colors.violet} stopOpacity="0" />
          </RadialGradient>
        </Defs>
        <Rect x="0" y="0" width="100%" height="100%" fill="url(#defeatGlow)" />
      </Svg>
      <Image source={character.image} style={styles.silhouette} resizeMode="contain" />
      <Shade stops={[[0, 0.3], [0.6, 0.1], [0.88, 0.75], [1, 1]]} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { position: 'absolute', top: 0, left: 0, right: 0, height: 420, overflow: 'hidden', alignItems: 'center' },
  silhouette: { position: 'absolute', top: 24, width: 390, height: 390, tintColor: '#16101F', opacity: 0.95 },
});

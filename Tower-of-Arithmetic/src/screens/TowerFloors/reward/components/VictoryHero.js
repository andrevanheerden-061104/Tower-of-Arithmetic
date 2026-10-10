import { Image, StyleSheet, View, useWindowDimensions } from 'react-native';
import Svg, { Defs, Path, RadialGradient, Rect, Stop } from 'react-native-svg';
import ScreenBackground from '../../../../components/ScreenBackground';
import Shade from '../../../../components/Shade';
import { colors } from '../../../../theme/theme';

// Golden rays behind the player's character (as a dark silhouette).
export default function VictoryHero({ character }) {
  const { width } = useWindowDimensions();
  const height = 440;
  const cx = width / 2;
  const cy = 210;
  const rays = Array.from({ length: 16 }, (_, i) => {
    const a1 = (i * 2 * Math.PI) / 16;
    const a2 = a1 + Math.PI / 30;
    const r = 700;
    return `M${cx} ${cy} L${cx + r * Math.cos(a1)} ${cy + r * Math.sin(a1)} L${cx + r * Math.cos(a2)} ${cy + r * Math.sin(a2)}Z`;
  });

  return (
    <View style={[styles.wrap, { height }]} pointerEvents="none">
      <ScreenBackground opacity={0.35} />
      <Svg width={width} height={height} style={StyleSheet.absoluteFill}>
        <Defs>
          <RadialGradient id="victoryGlow" cx="50%" cy="48%" r="45%">
            <Stop offset="0" stopColor={colors.gold} stopOpacity="0.95" />
            <Stop offset="0.5" stopColor={colors.gold} stopOpacity="0.35" />
            <Stop offset="1" stopColor={colors.gold} stopOpacity="0" />
          </RadialGradient>
        </Defs>
        {rays.map((d, i) => (
          <Path key={i} d={d} fill={colors.gold} opacity={0.14} />
        ))}
        <Rect x="0" y="0" width={width} height={height} fill="url(#victoryGlow)" />
      </Svg>
      <Image source={character.image} style={styles.silhouette} resizeMode="contain" />
      <Shade stops={[[0, 0.3], [0.55, 0], [0.85, 0.6], [1, 1]]} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { position: 'absolute', top: 0, left: 0, right: 0, overflow: 'hidden', alignItems: 'center' },
  silhouette: { position: 'absolute', top: 30, width: 400, height: 400, tintColor: '#0D0D0D' },
});

import { StyleSheet, View } from 'react-native';
import Svg, { ClipPath, Defs, Path, Rect } from 'react-native-svg';
import { colors } from '../../theme/theme';

const HEART =
  'M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z';

// One heart: full, half (left side filled) or empty (outline only).
export function Heart({ fill = 1, size = 20, color = colors.pink }) {
  const id = `half-${size}`;
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Defs>
        <ClipPath id={id}>
          <Rect x="0" y="0" width="12" height="24" />
        </ClipPath>
      </Defs>
      <Path d={HEART} fill="none" stroke={color} strokeWidth={2} strokeLinejoin="round" />
      {fill >= 1 && <Path d={HEART} fill={color} />}
      {fill === 0.5 && <Path d={HEART} fill={color} clipPath={`url(#${id})`} />}
    </Svg>
  );
}

// A row of hearts. Health is counted in halves, so 2.5 shows two full
// hearts and a half heart. Screen readers hear the number instead.
export default function HeartRow({ hearts, max, size = 20, color = colors.pink, gap = 4 }) {
  return (
    <View style={[styles.row, { gap }]} accessible accessibilityLabel={`${formatHearts(hearts)} of ${max} hearts`}>
      {Array.from({ length: max }, (_, i) => {
        const left = hearts - i;
        const fill = left >= 1 ? 1 : left >= 0.5 ? 0.5 : 0;
        return <Heart key={i} fill={fill} size={size} color={color} />;
      })}
    </View>
  );
}

// 2.5 -> "2½"
export function formatHearts(value) {
  const whole = Math.floor(value);
  const half = value - whole >= 0.5;
  if (whole === 0 && half) return '½';
  return `${whole}${half ? '½' : ''}`;
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center' },
});

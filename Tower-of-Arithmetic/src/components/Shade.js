import { useId } from 'react';
import { StyleSheet } from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';
import { colors } from '../theme/theme';

// A top-to-bottom gradient laid over a background so text stays readable.
// stops = [[position 0-1, opacity 0-1], ...]
export default function Shade({ stops, color = colors.bg, style }) {
  // Each gradient needs its own id or two on one screen would clash.
  const id = `shade${useId().replace(/[^a-zA-Z0-9]/g, '')}`;

  return (
    <Svg
      width="100%"
      height="100%"
      style={[StyleSheet.absoluteFill, style]}
      pointerEvents="none"
      preserveAspectRatio="none"
    >
      <Defs>
        <LinearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          {stops.map(([offset, opacity], i) => (
            <Stop key={i} offset={offset} stopColor={color} stopOpacity={opacity} />
          ))}
        </LinearGradient>
      </Defs>
      <Rect x="0" y="0" width="100%" height="100%" fill={`url(#${id})`} />
    </Svg>
  );
}

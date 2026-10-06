import { StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../theme/theme';

// '#0D0D0D' + 0.5 -> 'rgba(13,13,13,0.5)'
function withOpacity(hex, opacity) {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${opacity})`;
}

// A top-to-bottom gradient laid over a background so text stays readable.
// stops = [[position 0-1, opacity 0-1], ...]
//
// Uses expo-linear-gradient (a normal native view) rather than an SVG:
// on Android the SVG didn't stretch when the navigation bar hid and the
// screen grew, leaving an unshaded strip at the bottom.
export default function Shade({ stops, color = colors.bg, style }) {
  return (
    <LinearGradient
      colors={stops.map(([, opacity]) => withOpacity(color, opacity))}
      locations={stops.map(([offset]) => offset)}
      style={[StyleSheet.absoluteFill, style]}
      pointerEvents="none"
    />
  );
}

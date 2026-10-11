import { StyleSheet, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { colors } from '../../../theme/theme';

const PAD = 8; // space between the highlighted part and the gold ring

// A rounded rectangle as an SVG path.
function roundedRect({ x, y, width, height }, r) {
  return (
    `M${x + r} ${y} H${x + width - r} A${r} ${r} 0 0 1 ${x + width} ${y + r} ` +
    `V${y + height - r} A${r} ${r} 0 0 1 ${x + width - r} ${y + height} ` +
    `H${x + r} A${r} ${r} 0 0 1 ${x} ${y + height - r} V${y + r} A${r} ${r} 0 0 1 ${x + r} ${y} Z`
  );
}

// Grow a measured part by PAD on every side.
export function padded(rect) {
  return { x: rect.x - PAD, y: rect.y - PAD, width: rect.width + PAD * 2, height: rect.height + PAD * 2 };
}

// Darkens the whole screen except for the holes, and puts a glowing gold
// ring round each hole.
export default function Spotlight({ width, height, holes }) {
  const shapes = holes.map((hole) => ({ ...hole, r: Math.min(18, hole.height / 2, hole.width / 2) }));
  const d = `M0 0 H${width} V${height} H0 Z ` + shapes.map((s) => roundedRect(s, s.r)).join(' ');

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <Svg width={width} height={height}>
        <Path d={d} fill="rgb(5,5,10)" fillOpacity={0.76} fillRule="evenodd" />
      </Svg>
      {shapes.map((s, i) => (
        <View
          key={i}
          style={[styles.ring, { left: s.x, top: s.y, width: s.width, height: s.height, borderRadius: s.r }]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  ring: {
    position: 'absolute',
    borderWidth: 2.5,
    borderColor: colors.gold,
    boxShadow: '0px 0px 18px rgba(242,234,121,0.55)',
  },
});

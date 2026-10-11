import { StyleSheet, View } from 'react-native';
import Svg, { Circle, Line, Path, Text as SvgText } from 'react-native-svg';
import { CANVAS } from '../../game/generators/geometry';
import { colors, fonts } from '../../theme/theme';

const RAD = Math.PI / 180;

// An angle mark: part of a circle round `c`, from a1° to a2° (anticlockwise).
function arcPath({ c, r, a1, a2 }) {
  const point = (deg) => `${(c[0] + r * Math.cos(deg * RAD)).toFixed(2)} ${(c[1] - r * Math.sin(deg * RAD)).toFixed(2)}`;
  const big = a2 - a1 > 180 ? 1 : 0;
  return `M ${point(a1)} A ${r} ${r} 0 ${big} 0 ${point(a2)}`;
}

// Draws the shape for a geometry or measurement sum. The drawing itself is
// worked out by the sum maker (src/game/generators/geometry.js): this only
// puts its lines, circles, angle marks and labels on the screen.
export default function GeometryFigure({ figure, height = 150 }) {
  if (!figure) return null;
  const { lines = [], arcs = [], circles = [], labels = [] } = figure;
  const described = labels.map((l) => l.t).join(', ');
  return (
    <View style={[styles.wrap, { height }]} accessible accessibilityRole="image" accessibilityLabel={`Diagram with ${described}`}>
      <Svg width="100%" height="100%" viewBox={`0 0 ${CANVAS.width} ${CANVAS.height}`}>
        {circles.map(([cx, cy, r], i) => (
          <Circle key={`c${i}`} cx={cx} cy={cy} r={r} stroke={colors.white} strokeWidth={r < 2 ? 0 : 0.9} fill={r < 2 ? colors.white : 'none'} />
        ))}
        {lines.map(([x1, y1, x2, y2], i) => (
          <Line key={`l${i}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke={colors.white} strokeWidth={0.9} strokeLinecap="round" />
        ))}
        {arcs.map((arc, i) => (
          <Path key={`a${i}`} d={arcPath(arc)} stroke={colors.gold} strokeWidth={0.8} fill="none" />
        ))}
        {labels.map((label, i) => (
          <SvgText
            key={`t${i}`}
            x={label.x}
            y={label.y}
            fontSize={label.t === 'x' ? 8 : label.t.length > 4 ? 5.5 : 6.5}
            fontFamily={fonts.bold}
            fill={label.quiet ? colors.mute : label.t.includes('x') || label.t.includes('?') ? colors.gold : colors.white}
            textAnchor={label.anchor ?? 'middle'}
          >
            {label.t}
          </SvgText>
        ))}
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignSelf: 'stretch', marginTop: 4 },
});

import { StyleSheet, View, useWindowDimensions } from 'react-native';
import Text from '../../../components/AppText';
import { useTextScale } from '../../../context/TextSizeContext';
import Svg, { Circle, Line, Polygon } from 'react-native-svg';
import { colors, fonts, spacing } from '../../../theme/theme';

// The design size the chart was drawn at; it is scaled to fit the phone.
const BASE_WIDTH = 338;
const BASE_HEIGHT = 218;
const CENTRE_X = 169;
const CENTRE_Y = 110;
const RADIUS = 62;

// Point on the hexagon for strength number `i`, `r` away from the centre.
function point(i, r) {
  const angle = ((-90 + i * 60) * Math.PI) / 180;
  return [CENTRE_X + r * Math.cos(angle), CENTRE_Y + r * Math.sin(angle)];
}

const toPoints = (list) => list.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' ');

// Hex (radar) graph of how strong the player is in each maths type.
// Every value is also written as a number, so it never relies on shape alone.
export default function StrengthsHex({ strengths }) {
  const { width: screenWidth } = useWindowDimensions();
  const width = Math.min(screenWidth - spacing.gutter * 2, 420);
  const scale = width / BASE_WIDTH;

  // Bigger text needs more room above and below the chart
  const textScale = useTextScale();
  const extra = Math.max(0, 34 * (textScale - 1));

  const rings = [1 / 3, 2 / 3, 1].map((k) => toPoints(strengths.map((_, i) => point(i, RADIUS * k))));
  const shape = strengths.map((s, i) => point(i, (RADIUS * s.value) / 100));

  return (
    <View style={styles.wrap}>
      <Text style={styles.heading}>Strengths by dungeon type</Text>

      <View style={[styles.card, { height: BASE_HEIGHT * scale + extra * 2 }]}>
        <View style={{ height: BASE_HEIGHT * scale, marginTop: extra }}>
        <Svg width="100%" height="100%" viewBox={`0 0 ${BASE_WIDTH} ${BASE_HEIGHT}`}>
          {rings.map((points, i) => (
            <Polygon key={i} points={points} stroke={colors.border} strokeWidth={1} fill="none" />
          ))}
          {strengths.map((_, i) => {
            const [x, y] = point(i, RADIUS);
            return <Line key={i} x1={CENTRE_X} y1={CENTRE_Y} x2={x} y2={y} stroke={colors.border} strokeWidth={1} />;
          })}
          <Polygon
            points={toPoints(shape)}
            fill={colors.gold}
            fillOpacity={0.28}
            stroke={colors.gold}
            strokeWidth={2}
            strokeLinejoin="round"
          />
          {shape.map(([x, y], i) => (
            <Circle key={i} cx={x} cy={y} r={3.5} fill={colors.gold} />
          ))}
        </Svg>

        {/* Labels are normal text placed over the chart so they scale with
            the phone's font settings and are read by screen readers */}
        {strengths.map((s, i) => {
          const [x, y] = point(i, RADIUS + 10);
          const centred = i === 0 || i === 3;
          const rightSide = i === 1 || i === 2;
          const labelWidth = 90 * scale;
          const left = centred ? x * scale - labelWidth / 2 : rightSide ? x * scale + 4 : x * scale - labelWidth - 4;
          const top = i === 0 ? y * scale - 4 - 32 * textScale : i === 3 ? y * scale + 2 : y * scale - 17 * textScale;

          return (
            <Text
              key={s.label}
              style={[
                styles.label,
                { left, top, width: labelWidth, textAlign: centred ? 'center' : rightSide ? 'left' : 'right' },
              ]}
            >
              {s.label}
              {'\n'}
              <Text style={styles.value}>{s.value}%</Text>
            </Text>
          );
        })}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 8 },
  heading: {
    fontFamily: fonts.semibold,
    fontSize: 12,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    color: colors.mute,
  },
  card: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.panel,
    overflow: 'hidden',
  },
  label: {
    position: 'absolute',
    fontFamily: fonts.semibold,
    fontSize: 12,
    lineHeight: 16,
    color: colors.white,
  },
  value: { color: colors.gold },
});

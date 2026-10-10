import { StyleSheet, View } from 'react-native';
import Svg, { Circle, Rect, Text as SvgText } from 'react-native-svg';
import { colors } from '../../../../theme/theme';

// The door drawn as a rectangle with its side lengths, gold trim dashed.
export default function RectangleDiagram({ width, height, unit }) {
  return (
    <View style={styles.box} accessible accessibilityLabel={`Rectangle ${width} ${unit} wide and ${height} ${unit} high`}>
      <Svg width={260} height={140} viewBox="0 0 260 140">
        <SvgText x="120" y="18" fill={colors.white} fontSize="15" fontWeight="700" textAnchor="middle">
          {`${width} ${unit}`}
        </SvgText>
        <Rect x="40" y="30" width="160" height="96" fill="#2A1F4A" stroke={colors.gold} strokeWidth="3" strokeDasharray="8 6" />
        <Circle cx="182" cy="80" r="4" fill={colors.gold} />
        <SvgText x="210" y="84" fill={colors.white} fontSize="15" fontWeight="700">
          {`${height} ${unit}`}
        </SvgText>
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.bg,
  },
});

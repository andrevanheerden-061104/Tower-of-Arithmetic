import { StyleSheet, View } from 'react-native';
import Svg, { Circle, Path, Text as SvgText } from 'react-native-svg';
import { colors } from '../../../../theme/theme';

// Circle with centre O, diameter AB and point C on the circle.
export default function CircleDiagram() {
  return (
    <View
      style={styles.box}
      accessible
      accessibilityLabel="Circle with centre O. AB is a diameter. C is on the circle. Angle ABC is 35 degrees, angle BAC is unknown."
    >
      <Svg width={240} height={150} viewBox="0 0 240 150">
        <Circle cx="120" cy="78" r="64" fill="none" stroke="#8C82A3" strokeWidth="2.5" />
        <Path d="M56 78 L184 78 L102 17 Z" fill="none" stroke={colors.white} strokeWidth="2.5" strokeLinejoin="round" />
        <Circle cx="120" cy="78" r="3.5" fill={colors.white} />
        <SvgText x="42" y="83" fill={colors.white} fontSize="14" fontWeight="700">A</SvgText>
        <SvgText x="190" y="83" fill={colors.white} fontSize="14" fontWeight="700">B</SvgText>
        <SvgText x="96" y="12" fill={colors.white} fontSize="14" fontWeight="700">C</SvgText>
        <SvgText x="114" y="98" fill={colors.mute} fontSize="13" fontWeight="700">O</SvgText>
        <SvgText x="76" y="70" fill={colors.gold} fontSize="13" fontWeight="700">?</SvgText>
        <SvgText x="150" y="72" fill={colors.white} fontSize="12" fontWeight="700">35°</SvgText>
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.bg,
  },
});

import { StyleSheet, View } from 'react-native';
import Svg, { Circle, Line, Path, Rect } from 'react-native-svg';
import Text from '../../../../components/AppText';
import Shape from './Shape';
import { colors, fonts } from '../../../../theme/theme';

// The arched magic door with the shape pattern across it. The last spot
// shows "?" until the player picks a shape.
export default function MagicDoor({ sequence, answer }) {
  return (
    <View style={styles.wrap} accessible accessibilityLabel={`Pattern: ${sequence.join(', ')}, then what?`}>
      <Svg width={260} height={290} viewBox="0 0 260 290" style={styles.door}>
        <Path d="M10 290V130a120 120 0 0 1 240 0v160" fill="#3A2780" stroke={colors.gold} strokeWidth="5" />
        <Path d="M24 290V134a106 106 0 0 1 212 0v156" fill="#4C33A6" stroke="#8C70E0" strokeWidth="2" />
        <Line x1="130" y1="30" x2="130" y2="290" stroke="#2A1F5C" strokeWidth="3" />
        {[70, 100, 160, 190].map((x) => (
          <Line key={x} x1={x} y1="80" x2={x} y2="290" stroke="#5B44B8" strokeWidth="2" />
        ))}
        <Circle cx="130" cy="230" r="11" fill={colors.gold} />
        <Rect x="124" y="234" width="12" height="20" rx="2" fill={colors.gold} />
        <Circle cx="130" cy="230" r="4" fill="#2A1F5C" />
      </Svg>

      <View style={styles.strip}>
        {sequence.map((kind, i) => (
          <Shape key={i} kind={kind} size={34} />
        ))}
        <View style={styles.blank}>
          {answer ? <Shape kind={answer} size={30} /> : <Text style={styles.q}>?</Text>}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { height: 300, alignItems: 'center', justifyContent: 'flex-end', marginTop: 10 },
  door: { position: 'absolute', bottom: 0 },
  strip: {
    position: 'absolute',
    top: 110,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: colors.gold,
    backgroundColor: colors.bg,
  },
  blank: {
    width: 42,
    height: 42,
    borderRadius: 8,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: colors.gold,
    alignItems: 'center',
    justifyContent: 'center',
  },
  q: { fontFamily: fonts.bold, fontSize: 22, color: colors.gold },
});

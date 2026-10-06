import { StyleSheet, View } from 'react-native';
import Text from '../../../components/AppText';
import Svg, { Circle, Path, Rect } from 'react-native-svg';
import { colors, fonts } from '../../../theme/theme';

// The little illustrated icon that sits on top of each tile.
function TileArt({ art }) {
  if (art === 'tower') {
    return (
      <Svg width={38} height={38} viewBox="0 0 24 24">
        <Path d="M7 22V9h10v13z" fill="#70468C" stroke="#E6D9FF" strokeWidth={1.2} strokeLinejoin="round" />
        <Path d="M6 9V5h2.4v2h2.2V5h2.8v2h2.2V5H18v4z" fill="#A77BFF" stroke="#E6D9FF" strokeWidth={1.2} strokeLinejoin="round" />
        <Path d="M10.5 22v-5a1.5 1.5 0 0 1 3 0v5z" fill="#1B1030" />
        <Rect x={11} y={11.5} width={2} height={2.6} fill={colors.gold} />
      </Svg>
    );
  }
  if (art === 'flag') {
    return (
      <Svg width={38} height={38} viewBox="0 0 24 24">
        <Path d="M6 3v18.5" stroke="#FFF3C4" strokeWidth={2.2} strokeLinecap="round" />
        <Path d="M6 4h12.5l-3 4.2 3 4.3H6z" fill={colors.gold} stroke="#9C8B2B" strokeWidth={1.2} strokeLinejoin="round" />
      </Svg>
    );
  }
  return (
    <Svg width={38} height={38} viewBox="0 0 24 24">
      <Circle cx={12} cy={12} r={9.5} fill="#FFB86B" stroke="#FFF3C4" strokeWidth={1.2} />
      <Circle cx={12} cy={12} r={6} fill="#FFF3C4" />
      <Circle cx={12} cy={12} r={2.6} fill="#FF7A3D" />
    </Svg>
  );
}

// One stat: an icon rising out of the top, the number, and a label.
export default function StatTile({ value, label, art, accent }) {
  return (
    <View style={[styles.tile, { borderColor: accent }]} accessibilityLabel={`${label}: ${value}`}>
      <View style={styles.art}>
        <TileArt art={art} />
      </View>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label} numberOfLines={2}>
        {label}
      </Text>
      <View style={[styles.accent, { backgroundColor: accent }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  // Every tile is laid out from the top down with the same spacing, so the
  // numbers line up across the row however long each label is.
  tile: {
    flex: 1,
    minHeight: 100, // grows if Large text needs more room
    alignItems: 'center',
    paddingTop: 26, // room for the icon sticking in from the top
    paddingHorizontal: 6,
    paddingBottom: 10, // keeps the label clear of the coloured line
    borderRadius: 16,
    borderWidth: 1.5,
    backgroundColor: '#2A1F4A',
  },
  art: { position: 'absolute', top: -16 },
  value: { fontFamily: fonts.bold, fontSize: 22, lineHeight: 28, color: colors.white },
  // Always two lines tall, so one-line and two-line labels take the same space.
  label: {
    fontFamily: fonts.medium,
    fontSize: 12,
    lineHeight: 15,
    minHeight: 30,
    textAlign: 'center',
    color: colors.pink,
  },
  accent: { position: 'absolute', bottom: 0, width: 64, height: 3, borderRadius: 2 },
});

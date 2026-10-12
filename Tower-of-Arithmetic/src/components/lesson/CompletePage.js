import { StyleSheet, View } from 'react-native';
import Text from '../AppText';
import { colors, fonts } from '../../theme/theme';

// Last page: the badge, "Lesson complete" and two small result tiles.
export default function CompletePage({ lesson, symbol, practice }) {
  const solved = practice?.result === 'right';
  return (
    <View style={styles.wrap}>
      <View style={styles.badge} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
        <Text style={styles.symbol}>{symbol}</Text>
      </View>
      <Text style={styles.title} accessibilityRole="header">
        Lesson complete
      </Text>
      <Text style={styles.earned}>Badge earned: {lesson.badge}</Text>
      <View style={styles.tiles}>
        <View style={styles.tile}>
          <Text style={styles.tileValue}>{lesson.pages.length} ideas</Text>
          <Text style={styles.tileLabel}>learned</Text>
        </View>
        <View style={styles.tile}>
          <Text style={styles.tileValue} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.6}>
            {practice?.display ?? '—'}
          </Text>
          <Text style={styles.tileLabel}>{solved ? (practice.tries === 1 ? 'solved first time' : `solved in ${practice.tries} tries`) : 'worked through'}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', gap: 12 },
  badge: {
    width: 112,
    height: 112,
    borderRadius: 56,
    borderWidth: 4,
    borderColor: colors.gold,
    backgroundColor: colors.indigo,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0px 0px 26px rgba(242,234,121,0.4)',
  },
  symbol: { fontFamily: fonts.bold, fontSize: 46, color: colors.gold },
  title: { marginTop: 6, fontFamily: fonts.display, fontSize: 24, letterSpacing: 1, textTransform: 'uppercase', color: colors.gold },
  earned: { fontFamily: fonts.semibold, fontSize: 15, color: colors.white },
  tiles: { flexDirection: 'row', gap: 10, alignSelf: 'stretch' },
  tile: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
    paddingVertical: 14,
    paddingHorizontal: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.panel,
  },
  tileValue: { fontFamily: fonts.bold, fontSize: 18, color: colors.gold },
  tileLabel: { fontFamily: fonts.medium, fontSize: 12, color: colors.mute },
});

import { StyleSheet, View } from 'react-native';
import Text from '../AppText';
import { colors, fonts } from '../../theme/theme';

// First page of a lesson: a big three-part picture (x = ?), the tagline and
// a numbered list of what the lesson covers.
export default function IntroPage({ lesson, junior }) {
  const [first, middle, last] = lesson.hero;
  return (
    <View style={styles.wrap}>
      <View style={styles.hero} accessible accessibilityLabel={lesson.hero.join(' ')}>
        <View style={styles.box}>
          <Text style={styles.boxText}>{first}</Text>
        </View>
        <Text style={styles.middle}>{middle}</Text>
        <View style={styles.circle}>
          <Text style={styles.circleText}>{last}</Text>
        </View>
      </View>
      <Text style={styles.tagline} accessibilityRole="header">
        {lesson.tagline}
      </Text>
      <View style={styles.card}>
        <Text style={styles.label}>{junior ? 'YOU WILL LEARN' : 'WHAT YOU’LL LEARN'}</Text>
        {lesson.learn.map((item, i) => (
          <View key={item} style={styles.row}>
            <View style={styles.number}>
              <Text style={styles.numberText}>{i + 1}</Text>
            </View>
            <Text style={[styles.item, junior && styles.itemJunior]}>{item}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 16 },
  hero: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 16, marginTop: 4 },
  box: {
    width: 64,
    height: 64,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: colors.gold,
    backgroundColor: colors.indigo,
    alignItems: 'center',
    justifyContent: 'center',
  },
  boxText: { fontFamily: fonts.bold, fontSize: 30, color: colors.white },
  middle: { fontFamily: fonts.bold, fontSize: 30, color: colors.white },
  circle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: colors.gold,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleText: { fontFamily: fonts.bold, fontSize: 28, color: colors.gold },
  tagline: {
    fontFamily: fonts.display,
    fontSize: 19,
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: colors.gold,
    textAlign: 'center',
  },
  card: {
    gap: 12,
    padding: 18,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.panel,
  },
  label: { fontFamily: fonts.semibold, fontSize: 12, letterSpacing: 1.2, color: colors.mute },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  number: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.indigo,
    alignItems: 'center',
    justifyContent: 'center',
  },
  numberText: { fontFamily: fonts.bold, fontSize: 12, color: colors.white },
  item: { flex: 1, fontFamily: fonts.medium, fontSize: 15, color: colors.white },
  itemJunior: { fontFamily: fonts.semibold, fontSize: 17 },
});

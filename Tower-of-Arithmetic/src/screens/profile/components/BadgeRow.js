import { StyleSheet, View } from 'react-native';
import Text from '../../../components/AppText';
import Badge from './Badge';
import { colors, fonts } from '../../../theme/theme';

const PER_ROW = 3;

// Heading with the badge count, then the badges in rows of 3
// (src/data/badges.js).
export default function BadgeRow({ badges, total = badges.length }) {
  const earned = badges.filter((b) => b.earned).length;
  // empty spaces so the last row lines up with the ones above
  const fillers = (PER_ROW - (badges.length % PER_ROW)) % PER_ROW;

  return (
    <View style={styles.wrap}>
      <Text style={styles.heading}>
        Badges · {earned} of {total}
      </Text>
      <View style={styles.row}>
        {badges.map((badge) => (
          <Badge key={badge.id ?? badge.name} name={badge.name} description={badge.description} image={badge.image} earned={badge.earned} />
        ))}
        {Array.from({ length: fillers }, (_, i) => (
          <View key={`gap-${i}`} style={styles.filler} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 10 },
  heading: {
    fontFamily: fonts.semibold,
    fontSize: 12,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    color: colors.mute,
  },
  row: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: 18, alignItems: 'flex-start' },
  filler: { width: '31%' },
});

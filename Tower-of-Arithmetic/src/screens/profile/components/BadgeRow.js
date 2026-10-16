import { StyleSheet, View } from 'react-native';
import Text from '../../../components/AppText';
import Badge from './Badge';
import { colors, fonts } from '../../../theme/theme';

// Heading with the badge count, then a row of badges (src/data/badges.js).
export default function BadgeRow({ badges, total = badges.length }) {
  const earned = badges.filter((b) => b.earned).length;

  return (
    <View style={styles.wrap}>
      <Text style={styles.heading}>
        Badges · {earned} of {total}
      </Text>
      <View style={styles.row}>
        {badges.map((badge) => (
          <Badge key={badge.id ?? badge.name} name={badge.name} description={badge.description} image={badge.image} earned={badge.earned} />
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
  row: { flexDirection: 'row', gap: 11, alignItems: 'flex-start' },
});

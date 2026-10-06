import { StyleSheet, Text, View } from 'react-native';
import Badge from './Badge';
import { colors, fonts } from '../../../theme/theme';

// Heading with the badge count, then a row of medals.
export default function BadgeRow({ badges, total }) {
  const earned = badges.filter((b) => b.earned).length;

  return (
    <View style={styles.wrap}>
      <Text style={styles.heading}>
        Badges · {earned} of {total}
      </Text>
      <View style={styles.row}>
        {badges.map((badge, i) => (
          <Badge key={`${badge.name}-${i}`} name={badge.name} earned={badge.earned} />
        ))}
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
  row: { flexDirection: 'row', gap: 11 },
});

import { StyleSheet, View } from 'react-native';
import Text from '../../../../components/AppText';
import { colors, fonts } from '../../../../theme/theme';

// Shows which version of the game this player gets, e.g. "Senior · Grades 7–11".
export default function VersionBadge({ version }) {
  return (
    <View style={styles.badge}>
      <Text style={styles.text}>
        {version.label} · {version.grades} · {version.floors} floors
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.gold,
  },
  text: { fontFamily: fonts.semibold, fontSize: 12, color: colors.gold },
});

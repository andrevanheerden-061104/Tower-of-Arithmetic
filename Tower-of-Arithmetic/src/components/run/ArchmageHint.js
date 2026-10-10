import { StyleSheet, View } from 'react-native';
import Text from '../AppText';
import { colors, fonts } from '../../theme/theme';

// The Archmage helper with one hint at a time ("Hint 1 of 3").
export default function ArchmageHint({ hint, index, total, title = 'Archmage' }) {
  return (
    <View style={styles.card} accessibilityLiveRegion="polite">
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>A</Text>
        </View>
        <View>
          <Text style={styles.name}>{title}</Text>
          {total ? (
            <Text style={styles.count}>
              Hint {index + 1} of {total}
            </Text>
          ) : null}
        </View>
      </View>
      <Text style={styles.hint}>{hint}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    gap: 10,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: '#70468C',
    backgroundColor: '#2A1F4A',
  },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: colors.gold,
    backgroundColor: colors.indigo,
  },
  avatarText: { fontFamily: fonts.display, fontSize: 18, color: colors.white },
  name: { fontFamily: fonts.bold, fontSize: 16, color: colors.white },
  count: { fontFamily: fonts.regular, fontSize: 12, color: colors.mute },
  hint: { fontFamily: fonts.medium, fontSize: 16, lineHeight: 23, color: colors.white },
});

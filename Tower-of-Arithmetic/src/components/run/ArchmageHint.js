import { Image, StyleSheet, View } from 'react-native';
import Text from '../AppText';
import { GUIDE } from '../../data/guide';
import { useReadAloud } from '../../hooks/useReadAloud';
import { colors, fonts } from '../../theme/theme';

// The Archmage helper with one hint at a time ("Hint 1 of 3").
// With Read aloud on, each new hint is read out.
export default function ArchmageHint({ hint, index, total, title = GUIDE.name }) {
  useReadAloud(hint);
  return (
    <View style={styles.card} accessibilityLiveRegion="polite">
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Image source={GUIDE.face} style={styles.face} accessibilityLabel={GUIDE.name} />
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
    overflow: 'hidden',
  },
  face: { width: '100%', height: '100%' },
  name: { fontFamily: fonts.bold, fontSize: 16, color: colors.white },
  count: { fontFamily: fonts.regular, fontSize: 12, color: colors.mute },
  hint: { fontFamily: fonts.medium, fontSize: 16, lineHeight: 23, color: colors.white },
});

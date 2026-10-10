import { StyleSheet, View } from 'react-native';
import Text from '../../../../components/AppText';
import { colors, fonts } from '../../../../theme/theme';

// Intermediate picture help: the sum split into smaller, friendlier parts.
export default function BreakdownPicture({ picture }) {
  if (!picture) return null;
  return (
    <View style={styles.wrap} accessible accessibilityLabel={`Picture: ${picture.parts.join(', then ')}`}>
      {picture.parts.map((part, i) => (
        <View key={part} style={styles.part}>
          <Text style={styles.number}>{i + 1}</Text>
          <Text style={styles.text}>{part}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 8 },
  part: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.violet,
    backgroundColor: '#2A1F4A',
  },
  number: {
    width: 26,
    height: 26,
    borderRadius: 13,
    textAlign: 'center',
    lineHeight: 26,
    overflow: 'hidden',
    fontFamily: fonts.bold,
    fontSize: 13,
    color: colors.bg,
    backgroundColor: colors.gold,
  },
  text: { fontFamily: fonts.semibold, fontSize: 17, color: colors.white },
});

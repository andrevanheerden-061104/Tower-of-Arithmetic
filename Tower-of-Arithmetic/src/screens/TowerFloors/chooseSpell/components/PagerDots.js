import { StyleSheet, View } from 'react-native';
import Text from '../../../../components/AppText';
import { colors, fonts } from '../../../../theme/theme';

// "○ ● ○  Card 2 of 3"
export default function PagerDots({ count, index }) {
  return (
    <View style={styles.row} accessibilityLiveRegion="polite">
      {Array.from({ length: count }, (_, i) => (
        <View key={i} style={[styles.dot, i === index && styles.on]} />
      ))}
      <Text style={styles.text}>
        Card {index + 1} of {count}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  dot: { width: 10, height: 10, borderRadius: 5, borderWidth: 1.5, borderColor: colors.mute },
  on: { backgroundColor: colors.gold, borderColor: colors.gold },
  text: { marginLeft: 6, fontFamily: fonts.medium, fontSize: 14, color: colors.white },
});

import { Pressable, StyleSheet, View } from 'react-native';
import Text from '../../../components/AppText';
import Icon from '../../../components/Icon';
import { colors, fonts } from '../../../theme/theme';

// Back arrow, progress dashes and "2 of 2" at the top of onboarding.
export default function StepBar({ step, total, onBack }) {
  return (
    <View style={styles.wrap}>
      <Pressable onPress={onBack} accessibilityRole="button" accessibilityLabel="Go back" style={styles.back}>
        <Icon name="arrowLeft" size={22} />
      </Pressable>

      <View style={styles.steps} accessibilityLabel={`Step ${step} of ${total}`}>
        {Array.from({ length: total }, (_, i) => (
          <View key={i} style={[styles.dash, i < step && styles.dashDone]} />
        ))}
      </View>

      <Text style={styles.count}>
        {step} of {total}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  back: {
    width: 44,
    height: 44,
    marginLeft: -11, // keeps the arrow on the gutter while the tap area stays 44
    alignItems: 'center',
    justifyContent: 'center',
  },
  steps: { flexDirection: 'row', gap: 6 },
  dash: { width: 44, height: 4, borderRadius: 2, backgroundColor: colors.line },
  dashDone: { backgroundColor: colors.gold },
  count: { fontFamily: fonts.medium, fontSize: 12, color: colors.mute, minWidth: 44, textAlign: 'right' },
});

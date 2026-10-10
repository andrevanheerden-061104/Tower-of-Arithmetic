import { StyleSheet, View } from 'react-native';
import Text from '../../../../components/AppText';
import Icon from '../../../../components/Icon';
import { colors, fonts } from '../../../../theme/theme';

// Shown for a moment when the enemy is beaten, before the reward screen.
export default function VictoryToast({ name }) {
  return (
    <View style={styles.wrap} pointerEvents="none" accessibilityLiveRegion="assertive">
      <View style={styles.toast}>
        <Icon name="sparkles" size={22} color={colors.gold} />
        <Text style={styles.text}>{name} defeated!</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { ...StyleSheet.absoluteFillObject, alignItems: 'center', justifyContent: 'center' },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 22,
    paddingVertical: 14,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: colors.gold,
    backgroundColor: 'rgba(13,13,13,0.92)',
  },
  text: { fontFamily: fonts.bold, fontSize: 22, color: colors.white },
});

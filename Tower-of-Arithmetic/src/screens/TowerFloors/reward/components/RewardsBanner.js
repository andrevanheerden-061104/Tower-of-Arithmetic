import { StyleSheet, View } from 'react-native';
import Text from '../../../../components/AppText';
import { colors, fonts } from '../../../../theme/theme';

// "◆ Rewards ◆" heading strip.
export default function RewardsBanner({ label = 'Rewards' }) {
  return (
    <View style={styles.banner}>
      <Text style={styles.text} accessibilityRole="header">
        ◆  {label}  ◆
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    backgroundColor: 'rgba(112,70,140,0.45)',
  },
  text: { fontFamily: fonts.bold, fontSize: 15, color: colors.white },
});

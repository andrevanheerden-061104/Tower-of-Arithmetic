import { StyleSheet, View } from 'react-native';
import Text from '../../../components/AppText';
import Icon from '../../../components/Icon';
import { colors, fonts } from '../../../theme/theme';

// Shown in place of the starting spell when the character is locked.
export default function LockedPanel({ hint }) {
  return (
    <View style={styles.wrap}>
      <View style={styles.icon}>
        <Icon name="lock" size={26} color={colors.gold} />
      </View>
      <View style={styles.text}>
        <Text style={styles.title}>This character is locked</Text>
        <Text style={styles.hint}>{hint}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flexDirection: 'row', alignItems: 'center', gap: 16, minHeight: 134 },
  icon: {
    width: 64,
    height: 64,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: { flex: 1, gap: 4 },
  title: { fontFamily: fonts.bold, fontSize: 18, color: colors.white },
  hint: { fontFamily: fonts.regular, fontSize: 14, lineHeight: 20, color: colors.mute },
});

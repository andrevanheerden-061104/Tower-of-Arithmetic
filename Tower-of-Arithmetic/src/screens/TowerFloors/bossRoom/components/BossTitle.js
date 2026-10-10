import { StyleSheet, View } from 'react-native';
import Text from '../../../../components/AppText';
import { colors, fonts } from '../../../../theme/theme';

// "FLOOR 10 BOSS / Morvath / the Shadow Warden" under the HUD.
export default function BossTitle({ floor, name, title }) {
  return (
    <View style={styles.wrap} accessible accessibilityRole="header" accessibilityLabel={`Floor ${floor} boss: ${name}, ${title}`}>
      <Text style={styles.tag}>FLOOR {floor} BOSS</Text>
      <Text style={styles.name}>{name}</Text>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', gap: 2 },
  tag: { fontFamily: fonts.bold, fontSize: 12, letterSpacing: 1.6, color: colors.gold },
  name: { fontFamily: fonts.display, fontSize: 22, letterSpacing: 1, textTransform: 'uppercase', color: colors.white },
  title: { fontFamily: fonts.semibold, fontSize: 13, color: colors.pink },
});

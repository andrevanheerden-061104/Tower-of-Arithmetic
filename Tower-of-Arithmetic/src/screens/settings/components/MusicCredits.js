import { Linking, Pressable, StyleSheet, View } from 'react-native';
import Text from '../../../components/AppText';
import { colors, fonts } from '../../../theme/theme';

// Credits for the background music (required by the CC BY 4.0 licence).
const TRACKS = [
  { title: 'Magic Forest', use: 'Menus' },
  { title: 'Thunderbird', use: 'Tower' },
  { title: 'Future Gladiator', use: 'Fights' },
];
const LICENCE_URL = 'https://creativecommons.org/licenses/by/4.0/';

export default function MusicCredits() {
  return (
    <View style={styles.wrap}>
      {TRACKS.map((t, i) => (
        <View key={t.title} style={[styles.row, i < TRACKS.length - 1 && styles.divider]} accessible>
          <View style={styles.text}>
            <Text style={styles.title}>“{t.title}”</Text>
            <Text style={styles.by}>Kevin MacLeod (incompetech.com)</Text>
          </View>
          <Text style={styles.use}>{t.use}</Text>
        </View>
      ))}
      <Pressable
        onPress={() => Linking.openURL(LICENCE_URL)}
        accessibilityRole="link"
        accessibilityLabel="Licensed under Creative Commons: By Attribution 4.0. Open the licence"
        style={styles.licence}
      >
        <Text style={styles.licenceText}>Licensed under Creative Commons: By Attribution 4.0</Text>
        <Text style={styles.link}>{LICENCE_URL}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { paddingVertical: 6 },
  row: { minHeight: 56, flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 8 },
  divider: { borderBottomWidth: 1, borderBottomColor: colors.line },
  text: { flex: 1, gap: 2 },
  title: { fontFamily: fonts.semibold, fontSize: 15, color: colors.white },
  by: { fontFamily: fonts.regular, fontSize: 13, color: colors.mute },
  use: { fontFamily: fonts.medium, fontSize: 12, color: colors.gold },
  licence: { minHeight: 44, justifyContent: 'center', gap: 2, paddingTop: 10, borderTopWidth: 1, borderTopColor: colors.line },
  licenceText: { fontFamily: fonts.medium, fontSize: 12, color: colors.white },
  link: { fontFamily: fonts.medium, fontSize: 12, color: colors.gold, textDecorationLine: 'underline' },
});

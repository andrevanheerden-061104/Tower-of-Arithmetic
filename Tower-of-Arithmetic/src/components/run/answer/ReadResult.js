import { StyleSheet, View } from 'react-native';
import Text from '../../AppText';
import PrimaryButton from '../../PrimaryButton';
import { colors, fonts } from '../../../theme/theme';

// What Orrin heard or read, with "Try again" and "Use it". The maths goes
// into the player's step, where they can still fix it with the keypad.
export default function ReadResult({ title, maths, note, onAgain, onUse }) {
  return (
    <View style={styles.wrap} accessibilityLiveRegion="polite">
      <Text style={styles.title}>{title}</Text>
      {maths ? (
        <Text style={styles.maths} adjustsFontSizeToFit numberOfLines={1} minimumFontScale={0.5} accessibilityLabel={`${title} ${maths}`}>
          {maths}
        </Text>
      ) : (
        <Text style={styles.none}>Orrin couldn’t find any maths in that. Try again a little slower.</Text>
      )}
      {note ? <Text style={styles.note} numberOfLines={2}>{note}</Text> : null}
      <View style={styles.actions}>
        <PrimaryButton label="Try again" variant="secondary" onPress={onAgain} style={styles.button} />
        {maths ? <PrimaryButton label="Use it" onPress={() => onUse(maths)} style={styles.button} /> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, justifyContent: 'center', gap: 8 },
  title: { fontFamily: fonts.semibold, fontSize: 12, letterSpacing: 1.2, textTransform: 'uppercase', color: colors.mute, textAlign: 'center' },
  maths: { fontFamily: fonts.bold, fontSize: 30, color: colors.gold, textAlign: 'center' },
  none: { fontFamily: fonts.medium, fontSize: 15, lineHeight: 21, color: colors.white, textAlign: 'center' },
  note: { fontFamily: fonts.regular, fontSize: 13, color: colors.mute, textAlign: 'center' },
  actions: { flexDirection: 'row', gap: 10, marginTop: 4 },
  button: { flex: 1, alignSelf: 'auto', height: 48 },
});

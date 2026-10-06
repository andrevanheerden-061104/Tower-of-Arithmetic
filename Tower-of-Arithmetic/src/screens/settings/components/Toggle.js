import { StyleSheet, Text, View } from 'react-native';
import { colors, fonts } from '../../../theme/theme';

// The on/off switch drawing. It shows the word On or Off as well as
// colour, so it never relies on colour alone. The whole row is the button.
export default function Toggle({ value }) {
  return (
    <View style={[styles.track, value ? styles.trackOn : styles.trackOff]}>
      <Text style={[styles.text, value ? styles.textOn : styles.textOff]}>
        {value ? 'On' : 'Off'}
      </Text>
      <View style={[styles.knob, value ? styles.knobOn : styles.knobOff]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    width: 64,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    justifyContent: 'center',
  },
  trackOn: { backgroundColor: colors.gold, borderColor: colors.gold },
  trackOff: { backgroundColor: colors.bg, borderColor: colors.border },
  text: { position: 'absolute', fontFamily: fonts.bold, fontSize: 12 },
  textOn: { left: 9, color: colors.bg },
  textOff: { right: 8, color: colors.white },
  knob: { position: 'absolute', width: 22, height: 22, borderRadius: 11 },
  knobOn: { right: 3, backgroundColor: colors.bg },
  knobOff: { left: 3, backgroundColor: colors.border },
});

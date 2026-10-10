import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Text from '../../../../components/AppText';
import PrimaryButton from '../../../../components/PrimaryButton';
import MagicDoor from './MagicDoor';
import Shape from './Shape';
import { colors, fonts } from '../../../../theme/theme';

// Junior: the magic door shows a pattern of shapes; tap the shape that
// comes next, then Check.
export default function PatternPuzzle({ puzzle, onCheck }) {
  const [choice, setChoice] = useState(null);

  return (
    <>
      <MagicDoor sequence={puzzle.sequence} answer={choice} />

      <Text style={styles.prompt}>Tap the right shape</Text>
      <View style={styles.options} accessibilityRole="radiogroup">
        {puzzle.options.map((kind) => {
          const on = choice === kind;
          return (
            <Pressable
              key={kind}
              onPress={() => setChoice(kind)}
              accessibilityRole="radio"
              accessibilityState={{ checked: on }}
              accessibilityLabel={kind}
              style={({ pressed }) => [styles.option, on && styles.on, pressed && styles.pressed]}
            >
              <Shape kind={kind} size={52} />
            </Pressable>
          );
        })}
      </View>

      <PrimaryButton label="Check" disabled={!choice} onPress={() => onCheck(choice === puzzle.answer)} />
    </>
  );
}

const styles = StyleSheet.create({
  prompt: { fontFamily: fonts.semibold, fontSize: 18, color: colors.white, textAlign: 'center', marginTop: 6 },
  options: { flexDirection: 'row', gap: 12 },
  option: {
    flex: 1,
    height: 96,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2A2340',
  },
  on: { borderWidth: 3, borderColor: colors.gold, backgroundColor: colors.indigo },
  pressed: { opacity: 0.8 },
});

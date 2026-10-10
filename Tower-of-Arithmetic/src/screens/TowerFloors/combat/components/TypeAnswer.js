import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Text from '../../../../components/AppText';
import Icon from '../../../../components/Icon';
import PrimaryButton from '../../../../components/PrimaryButton';
import NumberPad from '../../../../components/run/NumberPad';
import BreakdownPicture from './BreakdownPicture';
import QuestionBox from './QuestionBox';
import SheetBody from './SheetBody';
import { colors, fonts } from '../../../../theme/theme';

const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '⌫', '0', 'ok'];

// Intermediate: work it out, type the final answer. The sum, answer box and
// picture scroll; the keypad and Cast spell always stay at the bottom.
export default function TypeAnswer({ question, onSubmit }) {
  const [answer, setAnswer] = useState('');
  const [picture, setPicture] = useState(false);

  const press = (key) => {
    if (key === '⌫') setAnswer((a) => a.slice(0, -1));
    else if (key === 'ok') answer && onSubmit(answer);
    else setAnswer((a) => (a.length < 6 ? a + key : a));
  };

  return (
    <SheetBody
      header={<QuestionBox question={question} compact />}
      scroll={
        <>
          <View style={styles.field} accessible accessibilityLabel={`Your answer: ${answer || 'empty'}`}>
            <Text style={styles.fieldLabel}>Your answer</Text>
            <Text style={styles.fieldValue}>{answer}|</Text>
          </View>
          <Pressable
            onPress={() => setPicture((p) => !p)}
            accessibilityRole="button"
            accessibilityState={{ expanded: picture }}
            accessibilityLabel={picture ? 'Hide the picture' : 'Show me a picture'}
            style={({ pressed }) => [styles.pictureButton, pressed && styles.pressed]}
          >
            <Icon name="image" size={20} color={colors.gold} />
            <Text style={styles.pictureText}>{picture ? 'Hide the picture' : 'Show me a picture'}</Text>
          </Pressable>
          {picture && <BreakdownPicture picture={question.picture} />}
        </>
      }
      footer={
        <>
          <NumberPad keys={KEYS} columns={3} onKey={press} keyHeight={44} />
          <PrimaryButton label="Cast spell" disabled={!answer} onPress={() => onSubmit(answer)} />
        </>
      }
    />
  );
}

const styles = StyleSheet.create({
  field: {
    height: 58,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: colors.gold,
    backgroundColor: colors.bg,
  },
  fieldLabel: { fontFamily: fonts.medium, fontSize: 14, color: colors.mute },
  fieldValue: { fontFamily: fonts.bold, fontSize: 28, color: colors.gold },
  pictureButton: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: '#2A1F4A',
  },
  pressed: { opacity: 0.8 },
  pictureText: { fontFamily: fonts.semibold, fontSize: 16, color: colors.white },
});

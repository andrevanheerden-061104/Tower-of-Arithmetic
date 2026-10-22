import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Text from '../../../../components/AppText';
import Icon from '../../../../components/Icon';
import PrimaryButton from '../../../../components/PrimaryButton';
import AnswerInput from '../../../../components/run/answer/AnswerInput';
import { TYPE_COLUMNS, TYPE_KEYS } from '../../../../game/keypads';
import VisualHelper from '../../../../components/run/visual/VisualHelper';
import { useDyscalculia } from '../../../../context/DyscalculiaContext';
import BreakdownPicture from './BreakdownPicture';
import QuestionBox from './QuestionBox';
import SheetBody from './SheetBody';
import { colors, fonts } from '../../../../theme/theme';

// Intermediate: work it out, type the final answer: a whole number, a
// fraction (3/4) or a decimal (2.5). The sum, answer box and
// picture scroll; the keypad and Cast spell always stay at the bottom.
// Speak or Draw fill in the answer box (just the final number). The sheet
// rises (up to just under the menu button) until the answer box fits.
export default function TypeAnswer({ question, onSubmit, speech, onOverflow }) {
  const [answer, setAnswer] = useState('');
  // Dyscalculia mode opens the picture straight away
  const [picture, setPicture] = useState(useDyscalculia());

  const press = (key) => {
    if (key === '⌫') setAnswer((a) => a.slice(0, -1));
    else if (key === 'ok') answer && onSubmit(answer);
    else setAnswer((a) => (a.length < 8 ? a + key : a));
  };
  // "x = 12" or "the answer is 3/4": keep the number after the last "="
  const write = (text) => setAnswer(String(text).split('=').at(-1).replace(/[^0-9./]/g, '').slice(0, 8));

  // A sum with a drawing is too tall to stay fixed at the top: it scrolls
  const box = <QuestionBox question={question} compact />;
  const tall = Boolean(question.figure);

  return (
    <SheetBody
      onOverflow={onOverflow}
      header={tall ? null : box}
      scroll={
        <>
          {tall && box}
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
          <VisualHelper question={question} />
          {picture && <BreakdownPicture picture={question.picture} />}
        </>
      }
      footer={
        <>
          <AnswerInput pages={[TYPE_KEYS]} columns={TYPE_COLUMNS} keyHeight={44} onKey={press} onUse={write} speech={speech} example="three quarters" />
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

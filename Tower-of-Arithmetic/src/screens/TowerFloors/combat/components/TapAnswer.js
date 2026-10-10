import { Pressable, StyleSheet, View } from 'react-native';
import Text from '../../../../components/AppText';
import Icon from '../../../../components/Icon';
import DotPicture from './DotPicture';
import QuestionBox from './QuestionBox';
import SheetBody from './SheetBody';
import { colors, fonts } from '../../../../theme/theme';

// Junior: the sum with dots to count (scrolls if needed), then three big
// answers and "Help me", which always stay at the bottom.
export default function TapAnswer({ question, onSubmit, onHelp }) {
  return (
    <SheetBody
      scroll={
        <QuestionBox question={question}>
          <DotPicture picture={question.picture} />
        </QuestionBox>
      }
      footer={
        <>
          <View style={styles.answers} accessibilityRole="radiogroup">
            {question.choices.map((choice) => (
              <Pressable
                key={choice}
                onPress={() => onSubmit(choice)}
                accessibilityRole="button"
                accessibilityLabel={`Answer ${choice}`}
                style={({ pressed }) => [styles.answer, pressed && styles.pressed]}
              >
                <Text style={styles.answerText}>{choice}</Text>
              </Pressable>
            ))}
          </View>
          <Pressable
            onPress={onHelp}
            accessibilityRole="button"
            accessibilityLabel="Help me"
            style={({ pressed }) => [styles.help, pressed && styles.pressed]}
          >
            <Icon name="lightbulb" size={20} color={colors.gold} />
            <Text style={styles.helpText}>Help me</Text>
          </Pressable>
        </>
      }
    />
  );
}

const styles = StyleSheet.create({
  answers: { flexDirection: 'row', gap: 12 },
  answer: {
    flex: 1,
    height: 84,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: colors.gold,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2A1F4A',
  },
  pressed: { opacity: 0.75, transform: [{ scale: 0.97 }] },
  answerText: { fontFamily: fonts.bold, fontSize: 34, color: colors.white },
  help: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: '#2A1F4A',
  },
  helpText: { fontFamily: fonts.bold, fontSize: 18, color: colors.white },
});

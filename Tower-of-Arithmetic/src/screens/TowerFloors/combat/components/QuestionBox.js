import { StyleSheet, View } from 'react-native';
import Text from '../../../../components/AppText';
import GeometryFigure from '../../../../components/run/GeometryFigure';
import MathText from '../../../../components/run/visual/MathText';
import { useDyscalculia } from '../../../../context/DyscalculiaContext';
import { spaced } from '../../../../game/visualModel';
import { colors, fonts } from '../../../../theme/theme';

// The sum in a dark box: a short instruction, a drawing when the sum has
// one (geometry, rectangles) and the sum in big numbers. A word problem's
// story is shown above the sum. In Dyscalculia mode the sum is bigger and
// spaced out, and the numbers in the words are gold (Figma 08a / 08b).
export default function QuestionBox({ question, compact, children }) {
  const dyscalculia = useDyscalculia();
  const spoken = [question.story, question.instruction, question.display].filter(Boolean).join('. ');
  const Words = dyscalculia ? MathText : Text;
  return (
    <View style={styles.box} accessible accessibilityLabel={spoken}>
      {question.story ? <Words style={[styles.story, dyscalculia && styles.bigWords]}>{question.story}</Words> : null}
      <Words style={[styles.instruction, dyscalculia && styles.bigWords]} testID="question-instruction">
        {question.instruction}
      </Words>
      <GeometryFigure figure={question.figure} height={compact ? 130 : 160} />
      <Text
        style={[styles.sum, compact && styles.compact, dyscalculia && styles.dyscalculia]}
        testID="question-sum"
        adjustsFontSizeToFit
        minimumFontScale={0.5}
        numberOfLines={dyscalculia ? 3 : 2}
      >
        {dyscalculia ? spaced(question.display) : question.display}
      </Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    alignItems: 'center',
    gap: 6,
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.bg,
  },
  story: { fontFamily: fonts.medium, fontSize: 15, lineHeight: 21, color: colors.white, textAlign: 'center' },
  instruction: { fontFamily: fonts.medium, fontSize: 14, lineHeight: 19, color: colors.white, textAlign: 'center' },
  sum: { fontFamily: fonts.bold, fontSize: 36, color: colors.white, textAlign: 'center' },
  compact: { fontSize: 28 },
  dyscalculia: { fontSize: 38, letterSpacing: 1.5 },
  bigWords: { fontSize: 16, lineHeight: 23 },
});
